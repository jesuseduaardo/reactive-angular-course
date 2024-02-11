import { CoursesService } from './../services/courses.service';
import {AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Course} from '../model/course';
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll, shareReplay, catchError
} from 'rxjs/operators';
import {merge, fromEvent, Observable, concat, throwError, combineLatest} from 'rxjs';
import {Lesson} from '../model/lesson';
import { LoadingService } from '../loading/loading.service';

interface CourseWithLessons {
  course: Course;
  lessons: Lesson[];
}
/*
  Existen varios operadores para combinar la data obtenida simultaneamente de varios observers:

  - zip(observable1, observable2): este operador espera a que ambos valores cambien para emitirlos juntos.
    Ejemplo:
      zip(color$, logo$).subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));

  - combineLatest(observable1, observable2): Este emitira en cuanto ambos observers terminen y luego en cuanto
    uno u otro observer emitan cambios
    Ejemplo:
      combineLatest(color$, logo$).subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));

  - withLatestFrom(observable2): En este caso emitira data si el observable2 emitio data
    Ejemplo:
      color$.pipe(withLatestFrom(logo$)).subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));

  - forkJoin(observer1, observer2): Esta funcion en particular solo emitira hasta que ambos observers esten
    completados, invocando para ello el callback observer1.complete() y observer2.complete().
    take(), takeUntil(), y first() son operadores que de forma automatica invocan el .complete()
    Ejemplo:
      const firstColor$ = color$.pipe(take(1));
      const firstLogo$ = logo$.pipe(first());
      forkJoin(firstColor$, firstLogo$).subscribe(([color, logo]) => console.log(`${color} shirt with ${logo}`));

  source: https://www.digitalocean.com/community/tutorials/rxjs-operators-forkjoin-zip-combinelatest-withlatestfrom
*/

@Component({
  selector: 'course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css'],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CourseComponent implements OnInit {

  courseWithLessons$: Observable<CourseWithLessons>;

  constructor(
    private route: ActivatedRoute,
    private coursesService: CoursesService,
    private loadingService: LoadingService
    ) {}

  ngOnInit() {
    const courseId = Number(this.route.snapshot.paramMap.get("courseId"));
    const course$ = this.coursesService.loadCourseById(courseId).pipe(
      //Primero emite lo que se le pase por parametro y luego emite la fuente
      startWith(null)
    )
    const lessons$ = this.coursesService.loadAllCourseLessons(courseId).pipe(
      //Primero emite lo que se le pase por parametro y luego emite la fuente
      startWith([])
    )

    // Con startWith(val) hacemos que ambos observers tenga un parametro emitido de forma incial
    // para que combineLatest() los pueda emitir juntos la primera vez y luego emita de forma independiente
    // el observer que cambie

    // combineLatest(obs1$, obs2$) la primera vez esperara a que ambos observers terminen
    // y luego independientemente de el observer que emita, emitira el observer con cambios y
    // el otro ya emitido

    const courseData$ = combineLatest([course$, lessons$]).pipe(
      map(([course, lessons])=> {
        return {
          course,
          lessons
        }
      }),
      tap(console.log)
    )

    this.courseWithLessons$ = this.loadingService.showLoaderUntilCompleted(courseData$);

  }




}













