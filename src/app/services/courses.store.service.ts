import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { response } from 'express';

@Injectable({
  // Esto significaria que solo tiene que haber
  // una instancia de este servicio para toda la aplicacion
  providedIn: 'root'
})
export class CoursesStoreService {

  /*
    - Se puede pensar en un observable como un datasource (la fuente que emite los datos)
    - Un Observable tiene 2 metodos subscribe y unsubscribe
    - Un observer es quien se subscribe a la fuente que emite la data (observable)
    - Cuando nos subscribimos a un observable este retorna un observer el cual tiene 3 metodos en el
      next(), error() y complete()
    - Un Subject puede actuar como observer y como un observable
    - asObservable() hace que el subject retorne un observable, la idea de esto es para que
      quien se subscriba no pueda usar el subject para emitir nuevos valores. Esto deja al
      CourseStoreService como la unica instancia capaz de emitir valores para este subject
  */

  private subject = new BehaviorSubject<Course[]>([]);
  courses$:Observable<Course[]> = this.subject.asObservable()

  constructor(
    private http:HttpClient,
    private loadingService: LoadingService,
    private messagesService: MessagesService,
  ) {
    this.loadAllCourses();
  }

  /*
    Partial, permite que solo se pasen los atributos que fueron cambiados
    para el objeto Course
  */
  saveCourse(courseId:string, changes:Partial<Course>):Observable<any>{
    // getValue() retorna el ultimo valor emitido por el subject
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex(course => course.id == courseId);
    const newCourse:Course = {
      ...courses[courseIndex],
      ...changes
    }

    const newCourses:Course[] = courses.slice(0);
    newCourses[courseIndex] = newCourse;

    this.subject.next(newCourses);

    return this.http.put(`/api/courses/${courseId}`, changes).pipe(
      catchError(err => {
        const message = "Could not save course";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      shareReplay()
    );
  }

  /*
      En home.component.ts llama a filterByCategory(category) para obtener los cursos
      segun la categoria.

      filterByCategory(category) retorna un observable (courses$) de los cursos, filtrados
      por categoria y ordenados por numero de secuencia.

      courses$ obtiene la data cuando en el constructor se invoca el metodo loadAllCourses(),
      este metodo busca los cursos en el backend y luego mediante un tap(), envia la data
      recibida al subject(observer) por medio del metodo next(), que a su vez retorna un observable
      al observable courses$ que es quien luego provee la data de los cursos al metodo
      filterByCategory(category)
  */
  filterByCategory(category:string):Observable<Course[]>{
    return this.courses$.pipe(
      map(courses =>  courses.filter(course => course.category == category).sort(sortCoursesBySeqNo))
    )
  }

  private loadAllCourses(){
    const loadCourses$ = this.http.get<Course[]>('api/courses').pipe(
      map(response => response["payload"]),
      catchError(err =>  {
        const message = "Could not load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      }),
      tap(courses =>  this.subject.next(courses))
    );

    this.loadingService.showLoaderUntilCompleted(loadCourses$)
    .subscribe();
  }

}
