import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../model/course';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CourseDialogComponent } from '../course-dialog/course-dialog.component';
import { filter, tap } from 'rxjs/operators';

@Component({
  selector: 'courses-card-list',
  templateUrl: './courses-card-list.component.html',
  styleUrl: './courses-card-list.component.css',
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class CoursesCardListComponent {

  @Input()
  courses:Course[]

  @Output()
  private coursesChanged = new EventEmitter();

  constructor(private dialog: MatDialog){}


  editCourse(course: Course) {

    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "400px";

    dialogConfig.data = course;

    const dialogRef = this.dialog.open(CourseDialogComponent, dialogConfig);
    dialogRef.afterClosed()
    .pipe(
      // El doble signo de interrogacion castea el valor de verdad en la variable
      // para el caso de !undefined, primero se castea el undefined a booleano, quedando en false
      // y luego se aplica el ! negandolo, quedando como true, al aplicar un segundo ! se niega nuevamente
      // quedando en su valor booleano por defecto, es decir falso
      // mas info ->https://stackoverflow.com/a/29312197
      filter(val => !!val),
      // Para el caso de que se habra el cuadro de dialogo y el componente CourseDialogComponent se cierre con
      // this.dialogRef.close(val); enviando val
      // entonces filtramos ese valor con el !!val, obteniendo solo valor true
      // y luego hacemos un tap() que lo que hace es crear un efecto secundario permitiendo emitir this.coursesChanged
      // de esta forma el padre de CoursesCardListComponent a traves del metodo
      // puesto en el evento (coursesChanged) = "func()" se ejecutara
      tap(()=> this.coursesChanged.emit())
    )
    .subscribe();

  }

}
