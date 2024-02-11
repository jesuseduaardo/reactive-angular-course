import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Course } from "../model/course";
import { map, shareReplay } from "rxjs/operators";
import { Lesson } from "../model/lesson";

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  constructor(private http: HttpClient) { }

  loadCourseById(courseId:number):Observable<Course>{
     return this.http.get<Course>(`/api/courses/${courseId}`).pipe(
      shareReplay()
     )
  }

  loadAllCourseLessons(courseId):Observable<Lesson[]>{
    return this.http.get<Lesson[]>(`/api/lessons`, {
      params: { pageSize: "10000", courseId: courseId.toString() }
    }).pipe(
      map(res=>res['payload']),
      // Evitamos que cada uno de los subscriptores hagan un nuevo llamado con shareReplay()
      shareReplay()
    )
  }

  loadAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>("/api/courses").pipe(
      map(res => res["payload"]),
      // Este operador almacena el ultimo estado y lo replica a los nuevos subscritores, evitando asi que se produsca
      // un nuevo llamado al recurso http
      shareReplay()
    );
  }

  saveCourse(courseId:String, changes:Partial<Course>):Observable<any>{
    return this.http.put(`api/courses/${courseId}`, changes).pipe(
      shareReplay()
    );
  }

  searchLessons(search:string):Observable<Lesson[]>{
    return this.http.get<Lesson[]>(`/api/lessons`, {
      params: { filter:search, pageSize: "100" }
    }).pipe(
      map(res=>res['payload']),
      // Evitamos que cada uno de los subscriptores hagan un nuevo llamado con shareReplay()
      shareReplay()
    )
  }


}
