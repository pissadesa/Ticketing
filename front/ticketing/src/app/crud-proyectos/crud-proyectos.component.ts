import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";


@Component({
  selector: 'app-crud-proyectos',
  templateUrl: './crud-proyectos.component.html',
  styleUrls: ['./crud-proyectos.component.css']
})
export class CrudProyectosComponent implements OnInit {

 

  arrayProyectos:Array<{idProyecto: number,idUsuario: number,nombre: string,nombreProyecto: string}>=[];


  constructor( private httpTickets: ServiciosTicketsService,private router: Router) {  
    this.getProyectos(); }

  ngOnInit(): void {
  
  }

getProyectos(){
  this.httpTickets.getProyectos().subscribe(
    datos => {
      this.arrayProyectos = [];
       var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json "+JSON.stringify(json));
            for(var i = 0 ; i < json.length; i++){
                this.arrayProyectos.push({idProyecto: json[i].idproyectoCuenta,
                                        idUsuario: json[i].idUsuario,                      
                                        nombre:  json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                        nombreProyecto: json[i].nombreproyecto
                                      });
              
            }

         
    });
}
btnActualizarProyecto(proyecto : any){
  this.router.navigate(['/proyecto', proyecto.idProyecto]);
}



}
