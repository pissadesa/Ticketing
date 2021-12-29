import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {MatButtonModule} from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CrudPersonaComponent } from './crud-persona/crud-persona.component';
import { CuPersonaComponent } from './cu-persona/cu-persona.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CrudTiposTicketsComponent } from './crud-tipos-tickets/crud-tipos-tickets.component';
import { CrudProyectosComponent } from './crud-proyectos/crud-proyectos.component';
import { AgmCoreModule } from '@agm/core';


import {MatSliderModule} from '@angular/material/slider';
import { TicketsComponent } from './tickets/tickets.component';
import { TicketComponent } from './ticket/ticket.component';

import { MatDatepickerModule } from '@angular/material/datepicker';

import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CuProyectoComponent } from './cu-proyecto/cu-proyecto.component';
import { LoginComponent } from './login/login.component';

import { CookieService } from 'ngx-cookie-service';
import { DispathComponent } from './dispath/dispath.component';
import { SeguimientoTicketComponent } from './seguimiento-ticket/seguimiento-ticket.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatDialogModule} from '@angular/material/dialog';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';

import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import {MatRadioModule} from '@angular/material/radio';
import { InicioComponent } from './inicio/inicio.component';
import { IngenieriaFlotanteComponent } from './ingenieria-flotante/ingenieria-flotante.component';
import { NuevoflotanteComponent } from './nuevoflotante/nuevoflotante.component';
import { TicketsFlotanteComponent } from './tickets-flotante/tickets-flotante.component';
import { FlotantesMasivaComponent } from './flotantes-masiva/flotantes-masiva.component';
import { DialogoFolioComponent } from './dialogo-folio/dialogo-folio.component';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AngularFireDatabaseModule } from '@angular/fire/database';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

import {MatPaginatorModule} from '@angular/material/paginator';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


export const   firebaseConfig = {
  databaseURL: "https://ticketing-6df47-default-rtdb.firebaseio.com/",
  apiKey: "AIzaSyBjU2RMJqvPgsYxe9qVkNbfHurLrZAzUOs",
  authDomain: "ticketing-6df47.firebaseapp.com",
  projectId: "ticketing-6df47",
  storageBucket: "ticketing-6df47.appspot.com",
  messagingSenderId: "660899398781",
  appId: "1:660899398781:web:8af3f6700f2b200faedd14"
}



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CrudPersonaComponent,
    CuPersonaComponent,
    CrudTiposTicketsComponent,
    CrudProyectosComponent,
    TicketsComponent,
    TicketComponent,
    CuProyectoComponent,
    LoginComponent,
    DispathComponent,
    SeguimientoTicketComponent,
    MenuLateralComponent,
    EstadisticasComponent,
    InicioComponent,
    IngenieriaFlotanteComponent,
    NuevoflotanteComponent,
    TicketsFlotanteComponent,
    FlotantesMasivaComponent,
    
    DialogoFolioComponent
  ],
  imports: [
    
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatProgressBarModule,
    BrowserModule,
    MatButtonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    MatSnackBarModule,
    MatSliderModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    NgbModule ,
    MatDialogModule,
    MatSlideToggleModule,
    MatRadioModule,
    AgmCoreModule.forRoot({
      // please get your own API key here:
      // https://developers.google.com/maps/documentation/javascript/get-api-key?hl=en
      apiKey: 'AIzaSyDjYLLhuRv0KkxFSgBafTX8LzewSwaC1hQ'
      //apiKey: 'AIzaSyAx1G6FZ_zAgSlqXhbmBv7fE8Ezjmyn_I4'
 
    }),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
 
  ],
  providers: [ CookieService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
