import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrudPersonaComponent } from './crud-persona/crud-persona.component';
import { CrudProyectosComponent } from './crud-proyectos/crud-proyectos.component';
import { CrudTiposTicketsComponent } from './crud-tipos-tickets/crud-tipos-tickets.component';
import { CuPersonaComponent } from './cu-persona/cu-persona.component';
import { CuProyectoComponent } from './cu-proyecto/cu-proyecto.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { FlotantesMasivaComponent } from './flotantes-masiva/flotantes-masiva.component';
import { HomeComponent } from './home/home.component';
import { IngenieriaFlotanteComponent } from './ingenieria-flotante/ingenieria-flotante.component';
import { InicioComponent } from './inicio/inicio.component';
import { LoginComponent } from './login/login.component';
import { NuevoflotanteComponent } from './nuevoflotante/nuevoflotante.component';
import { SeguimientoTicketComponent } from './seguimiento-ticket/seguimiento-ticket.component';
import { TicketComponent } from './ticket/ticket.component';
import { TicketsFlotanteComponent } from './tickets-flotante/tickets-flotante.component';
import { TicketsComponent } from './tickets/tickets.component';


const routes: Routes = [
  { path: 'admin', component: HomeComponent,  pathMatch: 'full'},
  { path: 'personas/:tipo', component: CrudPersonaComponent,  pathMatch: 'full'},
  { path: 'persona/:id/:tipo', component: CuPersonaComponent,  pathMatch: 'full'},
  { path: 'tiposTickets', component: CrudTiposTicketsComponent,  pathMatch: 'full'},
  { path: 'proyectos', component: CrudProyectosComponent,  pathMatch: 'full'},
  { path: 'proyecto/:id', component: CuProyectoComponent,  pathMatch: 'full'},
  { path: 'tickets/:pantalla', component: TicketsComponent,  pathMatch: 'full'},
  { path: 'ticket', component: TicketComponent,  pathMatch: 'full'},
  { path: '', component: LoginComponent,  pathMatch: 'full'},
  { path: 'seguimiento/:idTicket/:pantalla', component: SeguimientoTicketComponent,  pathMatch: 'full'},
  { path: 'dashboard', component: EstadisticasComponent,  pathMatch: 'full'},
  { path: 'home', component: InicioComponent,  pathMatch: 'full' },
  { path: 'flotantes', component: IngenieriaFlotanteComponent,  pathMatch: 'full' },
  { path: 'nuevoFlotante/:idFlotante', component: NuevoflotanteComponent,  pathMatch: 'full' },
  { path: 'ticketsFlotante/:idFlotante', component: TicketsFlotanteComponent,  pathMatch: 'full' },
  { path: 'cargaMasiva', component: FlotantesMasivaComponent,  pathMatch: 'full' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

})
export class AppRoutingModule { }
