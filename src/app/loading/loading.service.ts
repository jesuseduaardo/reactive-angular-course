import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, finalize, tap } from 'rxjs/operators';

@Injectable()
export class LoadingService {

  constructor() {
    console.log("Loading service created...");

  }

  private loadingSubject = new BehaviorSubject<boolean>(false);

  loading$:Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntilCompleted<T>(obs$:Observable<T>):Observable<T> {
    return of(null).pipe(
      tap(()=> this.loadingOn()),
      // concatMap: Mapea valores a un observable interno, se subscribe y emite, todo en orden secuencial.
      // este operador no se subscribe al proximo observable hasta no se complete el anterior
      // https://www.learnrxjs.io/learn-rxjs/operators/transformation/concatmap
      concatMap(()=> obs$),
      // finalize: llama a una funcion cuando se completa el observable asi sea con exito o con errores
      finalize(()=> this.loadingOff())
    )
  }


  loadingOn(){
    this.loadingSubject.next(true);
  }

  loadingOff(){
    this.loadingSubject.next(false);
  }

}
