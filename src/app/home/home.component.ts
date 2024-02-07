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
    private coursesService: CoursesService,
    private loadingService: LoadingService,
    private messagesService: MessagesService
    ) { }

  ngOnInit() {
    this.reloadCourses();
  }

  reloadCourses() {
    //this.loadingService.loadingOn()
    const courses$ = this.coursesService.loadAllCourses().pipe(
      map(courses => courses.sort(sortCoursesBySeqNo)),
      //finalize(()=> this.loadingService.loadingOff())
      catchError(err => {
        const message = "Could no load courses";
        this.messagesService.showErrors(message);
        console.log(message, err);
        return throwError(err);
      })
    );

    const loadCourses$ = this.loadingService.showLoaderUntilCompleted(courses$)

    /*
    Gracias al pipe async en el template,
    la variable beginnerCourses$ y advancedCourses$
    estan siendo subscritas (llamadas) en el template
    */
    this.beginnerCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "BEGINNER"))
    );

    this.advancedCourses$ = loadCourses$.pipe(
      map(courses => courses.filter(course => course.category == "ADVANCED"))
    );
  }

}




