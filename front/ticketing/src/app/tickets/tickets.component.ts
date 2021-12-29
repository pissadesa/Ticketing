import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importar
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


import { ServiciosTicketsService } from '../servicios/servicios-tickets.service';
import { PageEvent } from '@angular/material/paginator';




@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {

  
  
  paginaActual = 0;
  itemPage = 10;
  numeroTickets = 0;

  
  showSpinner = true;
  keyBusqueda = "";

  sesion : any;
  visibleButton = 0;
  arrayTickets:Array<{idTicket: number,asunto: string, status: string, prioridad: string ,fecha: string, asignado: string, sla: number, proyecto: string, folio: string, descripcion: string}>=[];
  arrayShow:Array<{idTicket: number,asunto: string, status: string, prioridad: string ,fecha: string, asignado: string, sla: number, proyecto: string, folio: string, descripcion: string}>=[];

  
  
  
  constructor(config: NgbModalConfig, private modalService: NgbModal,
              private cookieService: CookieService,
              private route: ActivatedRoute,
              private router: Router,
              private httpTickets: ServiciosTicketsService) {
    
                config.backdrop = 'static';
                config.keyboard = false;


/************************************** */

if(this.cookieService.get('ticketingUser') != ""){
  this.sesion = JSON.parse(this.cookieService.get('ticketingUser'));
  if(this.sesion.status == "success"){



  }else{
   this.router.navigate(['']);
  }

}else{
  this.router.navigate(['']);
}
/************************************** */
    var accion = Number(this.route.snapshot.paramMap.get("pantalla"));
    if(accion == 1){
      this.visibleButton = 1;
    }
    this.getTickets();

   }

  ngOnInit(): void {
   
  }

  btnNuevoTicket(){
    this.router.navigate(['/ticket']);

  }
  


  getTickets(){
    var json = {
      "idTipoUsuario" : this.sesion.idTipoUsuario,
      "idLider" : this.sesion.idusuario
    }
    this.httpTickets.getTickets(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));

        this.arrayTickets = [];
        this.arrayShow = [];
        console.log("empiezo "+new Date().getTime());
         for(var i = json.length-1 ; i >= 0; i--){
            let idTicketJson = json[i].idticket;
            let fechaJson = json[i].fechaCreacion.toString().substring(0, 16);
            let asuntoJson = json[i].asunto;
            let asignadoJson = "";
            let statusJson = "";
            let prioridadJson = "";
           // let days = new Date().get() - new Date(json[i].fechaCreacion).getDay();
            let tiempoVid = 0;
           if(json[i].prioridad == 4){
            tiempoVid = json[i].tiempoUrgente; 
           }else{
            tiempoVid = json[i].tiempoVida;
           }
            
            
            
            tiempoVid = this.calcularTiempo(json[i].fechaCreacion, tiempoVid,json[i].fechaServicio, json[i].diashoras);
            switch(json[i].idEstatus){
              case 1:
                statusJson = "Abierto";
              break;
              case 2: 
              statusJson = "Pendiente";
              break;
              case 3: 
              statusJson = "Resuelto";
              break;
              case 4: 
              statusJson = "Cerrado el "+json[i].fechaServicio;
              break;
              case 5: 
              statusJson = "Reabierto";
              break;
            }


            switch(json[i].prioridad){
              case 1:
                prioridadJson = "Bajo";
              break;
              case 2: 
                prioridadJson = "Medio";
              break;
              case 3: 
                prioridadJson = "Alto";
              break;
              case 4: 
                prioridadJson = "Incidente mayor";
              break;
            }
         
            if(json[i].idAgente != 0){
                asignadoJson = "Asignado a: "+json[i].nombreAgente+" "+json[i].apPaternoAgente+" "+json[i].apMaternoAgente;
            }else{
              asignadoJson = "No asignado";
            }

           this.arrayTickets.push({
             idTicket: idTicketJson,
             asunto: asuntoJson,
             status : statusJson,
             prioridad : prioridadJson,
             asignado: asignadoJson,
             fecha: fechaJson,
             sla : tiempoVid,
             proyecto : json[i].nombreProyecto,
             folio: json[i].folio,
             descripcion:json[i].descripcion
           });
           
           if(this.arrayShow.length < 10){
            this.arrayShow.push({
              
             idTicket: idTicketJson,
             asunto: asuntoJson,
             status : statusJson,
             prioridad : prioridadJson,
             asignado: asignadoJson,
             fecha: fechaJson,
             sla : tiempoVid,
             proyecto : json[i].nombreProyecto,
             folio: json[i].folio,
             descripcion:json[i].descripcion
            });
           }
           
         }
         this.showSpinner = false;
         this.numeroTickets = this.arrayTickets.length;
        
      });
  }




btnDetalle(ticket: any){
  this.router.navigate(['/seguimiento', ticket.idTicket, this.visibleButton]);
}


calcularTiempo(fechaCreacion : string, horas: number, fechaCierre: string, diasHoras:string){
  fechaCreacion = fechaCreacion.substring(0, 19);
  var vec = diasHoras.split("|");
  var horasRango = vec[1].split(",");
  var horaAtencionInicio =  horasRango[0]+":00";
  var horaAtencionFin = horasRango[1]+":00";
/*
  var fecha1 = moment(fechaCreacion, "YYYY-MM-DD HH:mm:ss");
  var fecha2 = moment(new Date(), "YYYY-MM-DD HH:mm:ss");*/
  var diff = 0;//horas- fecha2.diff(fecha1, "h");
  if(fechaCierre != null){
    var diaRango = moment(fechaCreacion, "YYYY-MM-DD").format("YYYY-MM-DD");
     
    var fechaInicio = moment(diaRango+" "+horaAtencionInicio, "YYYY-MM-DD HH:mm:ss");
    var fechaFin = moment(diaRango+" "+horaAtencionFin, "YYYY-MM-DD HH:mm:ss");
    
    
    var fechaAux = moment(fechaCreacion, "YYYY-MM-DD HH:mm:ss");
    do{      
     
      if(!this.validarDia(fechaInicio.day(),vec[0])){
        fechaInicio.add(24,"h");
        fechaFin.add(24,"h");
        fechaAux.add(24,"h");
      }else{
        if(fechaAux >= fechaInicio  && fechaAux <= fechaFin){
          //fechaAux.add(1,"h");
          diff++;  
        }
        if(fechaAux.hour() == fechaFin.hour()){
          fechaInicio.add(24,"h");
          fechaFin.add(24,"h");
        }
        fechaAux.add(1,"h");
      }     
    }while(moment(fechaAux, "YYYY-MM-DD HH:mm:ss") <= moment(fechaCierre, "YYYY-MM-DD HH:mm:ss"));
    diff = horas-diff+1;
    
    
    
  }else{
    //si es estatus es diferente a resuelto o cerrado
    if(moment(fechaCreacion, "YYYY-MM-DD HH:mm:ss") <= moment(new Date(), "YYYY-MM-DD HH:mm:ss")){
      //la fecha de creacion es menor a la de hoy, sigue abierto  
      var diaRango = moment(fechaCreacion, "YYYY-MM-DD").format("YYYY-MM-DD");
      
      
      var fechaInicio = moment(diaRango+" "+horaAtencionInicio, "YYYY-MM-DD HH:mm:ss");
      var fechaFin = moment(diaRango+" "+horaAtencionFin, "YYYY-MM-DD HH:mm:ss");
      
      
      var fechaAux = moment(fechaCreacion, "YYYY-MM-DD HH:mm:ss");
      do{      

        if(!this.validarDia(fechaInicio.day(),vec[0])){
          fechaInicio.add(24,"h");
          fechaFin.add(24,"h");
          fechaAux.add(24,"h");
        }else{
          if(fechaAux >= fechaInicio  && fechaAux <= fechaFin){
            //fechaAux.add(1,"h");
          
            diff++;  
          }
          if(fechaAux.hour() == fechaFin.hour()){
            fechaInicio.add(24,"h");
            fechaFin.add(24,"h");
          }
          fechaAux.add(1,"h");
        }     
      }while(moment(fechaAux, "YYYY-MM-DD HH:mm:ss") <= moment(new Date(), "YYYY-MM-DD HH:mm:ss"));
      diff = horas-diff+1;
      
      
    }else{
      //la fecha de creacion es mas actual a la de hoy, por lo cual es ticket esta en pendiente
   
      
      
      var diaRango = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD");

      
      var fechaInicio = moment(diaRango+" "+horaAtencionInicio, "YYYY-MM-DD HH:mm:ss");
      var fechaFin = moment(diaRango+" "+horaAtencionFin, "YYYY-MM-DD HH:mm:ss");
      
      
      /***************************************************/
      var fechaAux = moment(new Date(), "YYYY-MM-DD HH:mm:ss");
      do{      

        if(!this.validarDia(fechaInicio.day(),vec[0])){
          fechaInicio.add(24,"h");
          fechaFin.add(24,"h");
          fechaAux.add(24,"h");
        }else{
          if(fechaAux >= fechaInicio  && fechaAux <= fechaFin){
            //fechaAux.add(1,"h");
        
            diff++;  
          }
          if(fechaAux.hour() == fechaFin.hour()){
            fechaInicio.add(24,"h");
            fechaFin.add(24,"h");
          }
          fechaAux.add(1,"h");
        }     
      }while(moment(fechaAux, "YYYY-MM-DD HH:mm:ss") <= moment(fechaCreacion, "YYYY-MM-DD HH:mm:ss"));
      diff = horas+diff;
      /***************************************************/
    }
    
  }
 
  return diff;
}


validarDia(dia:number, vecDia: string){
  var dias = vecDia.split("");
  if(dias[dia] === "1"){
    return true;
  }else{
    return false;
  }
}

  busqueda(){
    if(this.keyBusqueda.length >=3 ){
      this.arrayShow =  [];
      
      this.showSpinner = true;
      
      for(var i = 0 ; i < this.arrayTickets.length;i++){
        if(this.arrayTickets[i].folio.toLowerCase().includes(this.keyBusqueda.toLowerCase()) || 
           this.arrayTickets[i].asunto.toLowerCase().includes(this.keyBusqueda.toLowerCase()) ||
           this.arrayTickets[i].descripcion.toLowerCase().includes(this.keyBusqueda.toLowerCase())){
            this.arrayShow.push(this.arrayTickets[i]);
        }
      }
      
      
      this.showSpinner = false;
    
      
    }else{
      //this.arrayShow = this.arrayTickets;
      
      
      var inicio =  this.paginaActual*10;
      var fin = inicio +10;
     
      this.arrayShow = [];
      var limite = 0;
      if(this.arrayTickets.length > fin){
        
        limite = fin;  
      }else{
        
        limite = this.arrayTickets.length;
      }
      
      for(var i = inicio; i < limite; i++ ){
        this.arrayShow.push(this.arrayTickets[i]);    
      }
      
    }
  }

  
  open(content : any) {
    this.modalService.open(content);
  }
  
  handlePageEvent(event: PageEvent) {    
    
    var numeropagina = event.pageIndex+1;
    this.paginaActual = event.pageIndex; 
     var inicio =  event.pageIndex*10;
     var fin = inicio +10;
    
    this.arrayShow = [];
    var limite = 0;
    if(this.arrayTickets.length > fin){
      limite = fin;  
    }else{
      limite = this.arrayTickets.length;
    }
     for(var i = inicio; i < limite; i++ ){
       this.arrayShow.push(this.arrayTickets[i]);    
     }
  }
  
}
