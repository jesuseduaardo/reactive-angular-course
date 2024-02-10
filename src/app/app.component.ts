import {Component, OnInit} from '@angular/core';
import { LoadingService } from './loading/loading.service';
import { MessagesService } from './messages/messages.service';
import { AuthStoreService } from './services/auth.store.service';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers:[
    //Significa que este una instancia de este servicio estara disponible para este componente y sus hijos
    //LoadingService,
    //MessagesService
  ]
})
export class AppComponent implements  OnInit {

    constructor(public auth:AuthStoreService) {

    }

    ngOnInit() {


    }

  logout() {
    this.auth.logout();
  }

}
