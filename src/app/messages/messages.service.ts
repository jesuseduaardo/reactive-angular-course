import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MessagesService {

  /* El BehaviorSubject tiene la habilidad de emitir valores y emitir el ultimo valor a nuevos subscriptores */
  private subject = new BehaviorSubject<string[]>([]);
  
  errors$: Observable<string[]> = this.subject.asObservable().pipe(
    filter(messages =>  messages && messages.length > 0)
  );

  constructor() { }


  showErrors(...errors:string[]){
    this.subject.next(errors)
  }

}
