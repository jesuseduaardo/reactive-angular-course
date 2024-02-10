import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Course } from "../model/course";
import { FormBuilder, Validators, FormGroup } from "@angular/forms";
import * as moment from 'moment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { CoursesService } from '../services/courses.service';
import { LoadingService } from '../loading/loading.service';
import { MessagesService } from '../messages/messages.service';
import { CoursesStoreService } from '../services/courses.store.service';

@Component({
  selector: 'course-dialog',
  templateUrl: './course-dialog.component.html',
  styleUrls: ['./course-dialog.component.css'],
  //  Este componente, tira error al tratar de injectar el loading service, porque quien lo invoca es angular material,
  //  esto lo deja fuera del alcance de app.component, que es el que tiene una instancia ya creada del servicio.
  //  Al agregar a providers el LoadingService se crea una instancia aparte que puede injectar en el componente
  providers:[
    LoadingService,
    MessagesService
  ]
})
export class CourseDialogComponent implements AfterViewInit {

  form: FormGroup;

  course: Course;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    private coursesStoreService: CoursesStoreService,
    private messagesService: MessagesService,
    @Inject(MAT_DIALOG_DATA) course: Course) {

    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required]
    });

  }

  ngAfterViewInit() {

  }

  save() {
    const changes = this.form.value;
    this.coursesStoreService.saveCourse(this.course.id, changes).subscribe();
    this.dialogRef.close(changes);
  }

  close() {
    this.dialogRef.close();
  }

}
