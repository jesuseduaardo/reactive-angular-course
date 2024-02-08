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
    private coursesService: CoursesService,
    private loadingService: LoadingService,
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

    const saveCourse$ = this.coursesService.saveCourse(this.course.id, changes).pipe(
      // catchError necesita retornar un observable
      // es por eso que se retorna un throwError que crea un observable que no retorna items al observer
      // si no mas bien una notificacion del error, que vendria a reemplazar al observable emitido (o que emitiria)
      // el metodo saveCourse de coursesService
      catchError(err => {
        const message = "Could not save course";
        console.log(message, err);
        this.messagesService.showErrors(message);
        return throwError(err);
      })
    );

    this.loadingService.showLoaderUntilCompleted(saveCourse$).subscribe((val) => {
      this.dialogRef.close(val);
    });

  }

  close() {
    this.dialogRef.close();
  }

}
