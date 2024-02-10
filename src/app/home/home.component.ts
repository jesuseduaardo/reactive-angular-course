import { CoursesStoreService } from './../services/courses.store.service';
import { LoadingService } from './../loading/loading.service';
import { Component, OnInit } from '@angular/core';
import { Course, sortCoursesBySeqNo } from '../model/course';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { CoursesService } from '../services/courses.service';
import { MessagesService } from '../messages/messages.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor(
    //private coursesService: CoursesService,
    private coursesStoreService: CoursesStoreService,
    ) { }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    /*
    Gracias al pipe async en el template,
    la variable beginnerCourses$ y advancedCourses$
    estan siendo subscritas (llamadas) en el template
    */

    
    /* this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER"))
    ); */
    this.beginnerCourses$ = this.coursesStoreService.filterByCategory("BEGINNER")


    /* this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    ); */
    this.advancedCourses$ = this.coursesStoreService.filterByCategory("ADVANCED")
  }

}




