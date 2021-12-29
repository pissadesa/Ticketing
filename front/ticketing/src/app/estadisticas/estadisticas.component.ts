import { Component, OnInit } from '@angular/core';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ExportXlsService } from '../export-xls.service';


@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {

  selectLideres = 1;
  selectAgentes = 1;
  selectFlotantes = 1;
  selectProyectos = 1;


  liderSelected = 0;
  agenteSelected = 0;
  flotanteSelected = 0;
  proyectoSelected = 0;

  arrayLideres:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string}>=[];
  arrayAgentes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string}>=[];
  arrayProyectos:Array<{idProyecto: number,idUsuario: number,nombre: string,nombreProyecto: string}>=[];
  arrayFlotantes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string}>=[];

  

  arrayAllTickets:Array<{idTicket: number,
                          asunto: string,
                          proyecto: string, 
                          prioridad: number, 
                          estado: number,
                          idAgente: number}>=[];

  arrayShowTickets:Array<{idTicket: number,
                          asunto: string,
                          proyecto: string, 
                          prioridad: string, 
                          estado: string,
                          idAgente: number}>=[];
 
  
  
  totaltickets = 0;
  contadorAbiertos = 0;
  contadorPendientes = 0;
  contadorResueltos = 0;
  contadorCerrados = 0;
  contadorReabiertos = 0;
  contadorNoasignados = 0;
  checkEstatus = 0;
  checkPrioridad = 0;

sesion: any

  constructor(  private xlsServicio: ExportXlsService,private cookieService: CookieService,
    private router: Router,private httpTickets: ServiciosTicketsService) { 

/************************************** */

if(this.cookieService.get('ticketingUser') != ""){
  this.sesion = JSON.parse(this.cookieService.get('ticketingUser'));
  console.log(this.sesion+" "+JSON.stringify(this.sesion));
  if(this.sesion.status == "success"){



  }else{
   this.router.navigate(['']);
  }

}else{
  this.router.navigate(['']);
}
/************************************** */
this.identificarUsuario();

  }

  ngOnInit(): void {
  }

  getLideres(){
    var json ={
      "idTipo" : 2
    }
    this.arrayLideres = [];
    this.httpTickets.getPersonas(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = 0 ; i < json.length; i++){
                this.arrayLideres.push({ id: json[i].idusuario, 
                                          nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                            municipio: json[i].municipio, estado: json[i].estado, telefono: json[i].telefono, correo: json[i].email
                                        });
             }
         
  });
  }

  getAgentes(){
    var json ={
      "idTipo" : 4
    }
    this.arrayAgentes = [];
    this.httpTickets.getPersonas(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));

             for(var i = 0 ; i < json.length; i++){
              this.arrayAgentes.push({ id: json[i].idusuario, 
                                        nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                          municipio: json[i].municipio, estado: json[i].estado, telefono: json[i].telefono, correo: json[i].email
                                      });
           }
          
         
  });
  }


  getAllContadores(){
    var json = {};
    this.httpTickets.getContadoresAll(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
  
          this.totaltickets = json[0].totalTickets;
          this.contadorAbiertos = json[0].estatus1;
          this.contadorPendientes =  json[0].estatus2;;
          this.contadorResueltos = json[0].estatus3;
          this.contadorCerrados = json[0].estatus4;
          this.contadorReabiertos = json[0].estatus5;
          this.contadorNoasignados = json[0].estatus6;
           
      });
  }


  getContadoresProyecto(){
    var json = {
      "idProyecto" : this.proyectoSelected
    };
    this.httpTickets.getContadoresProyecto(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
  
          this.totaltickets = json[0].totalTickets;
          this.contadorAbiertos = json[0].estatus1;
          this.contadorPendientes =  json[0].estatus2;;
          this.contadorResueltos = json[0].estatus3;
          this.contadorCerrados = json[0].estatus4;
          this.contadorReabiertos = json[0].estatus5;
          
          this.contadorNoasignados = json[0].estatus6;
           
      });
  }

  getContadoresLider(){
    var json = {
      "idLider" : this.liderSelected
    };
    this.httpTickets.getContadoresLider(json).subscribe(
      datos => {
          var json = JSON.parse(JSON.stringify(datos));
          console.log(json+" esto en json "+JSON.stringify(json));
          this.totaltickets = json[0].totalTickets;
          this.contadorAbiertos = json[0].estatus1;
          this.contadorPendientes =  json[0].estatus2;;
          this.contadorResueltos = json[0].estatus3;
          this.contadorCerrados = json[0].estatus4;
          this.contadorReabiertos = json[0].estatus5;         
          this.contadorNoasignados = json[0].estatus6;
      });
  }

  getContadoresAgente(){
    var json = {
      "idAgente" : this.agenteSelected
    };
    this.httpTickets.getContadoresAgente(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
          console.log(json+" esto en json "+JSON.stringify(json)); 
          this.totaltickets = json[0].totalTickets;
          this.contadorAbiertos = json[0].estatus1;
          this.contadorPendientes =  json[0].estatus2;;
          this.contadorResueltos = json[0].estatus3;
          this.contadorCerrados = json[0].estatus4;
          this.contadorReabiertos = json[0].estatus5;
          this.contadorNoasignados = 0;
      });
  }

  getContadoresFlotante(){
    var json = {
      "idAgente" : this.flotanteSelected
    };
    this.httpTickets.getContadoresFlotantes(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
          console.log(json+" esto en json "+JSON.stringify(json)); 
          this.totaltickets = json[0].totalTickets;
          this.contadorAbiertos = json[0].estatus1;
          this.contadorPendientes =  json[0].estatus2;;
          this.contadorResueltos = json[0].estatus3;
          this.contadorCerrados = json[0].estatus4;
          this.contadorReabiertos = json[0].estatus5;
          this.contadorNoasignados = 0;
      });
  }

  getProyectos(){
    this.arrayProyectos = [];
    this.httpTickets.getProyectos().subscribe(
      datos => {
       
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


getAllTickets(){
    var json = {
      "idTipoUsuario" : this.sesion.idTipoUsuario,
      "idLider" : this.sesion.idusuario
    };
    this.httpTickets.getTickets(json).subscribe(
      datos => {
        this.arrayAllTickets = [];
        this.arrayShowTickets = [];
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
              for(var i = json.length-1 ; i >=0; i--){
                if(this.validarJson(json[i])){
                  this.arrayAllTickets.push({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus,
                    idAgente: json[i].idAgente}
                  );
                  this.insertShowArray({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus});

                }
                  
                 
              }
  
           
      });
  }


  getTicketsProyecto(){
    var json = {
        "idProyecto" : this.proyectoSelected
    };
    this.httpTickets.getTicketsProyecto(json).subscribe(
      datos => {
        
        this.arrayAllTickets = [];
        this.arrayShowTickets = [];
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
            
              for(var i = 0 ; i < json.length; i++){
                if(this.validarJson(json[i])){
                  this.arrayAllTickets.push({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus,
                    idAgente: json[i].idAgente}
                  );
                  
                  this.insertShowArray({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus});
              }
              console.log("traio "+json.length);
            }
           
      });
  }


  getTicketsLider(){
    var json = {
        "idLider" : this.liderSelected
    };
    this.httpTickets.getTicketsLider(json).subscribe(
      datos => {
        
        this.arrayAllTickets = [];
        this.arrayShowTickets = [];
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
       
              for(var i = 0 ; i < json.length; i++){
                if(this.validarJson(json[i])){
                  this.arrayAllTickets.push({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus,
                    idAgente: json[i].idAgente});
                  
                  this.insertShowArray({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus});

                      this.adddProyect(json[i].idProyecto,json[i].nombreProyecto);
                    
              }
            }
           
      });
  }


  getTicketsAgente(){
    var json = {
        "idAgente" : this.agenteSelected
    };
    this.httpTickets.getTicketsAgente(json).subscribe(
      datos => {
        
        this.arrayAllTickets = [];
        this.arrayShowTickets = [];
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
          
              for(var i = 0 ; i < json.length; i++){
                if(this.validarJson(json[i])){
                  this.arrayAllTickets.push({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus,
                    idAgente: json[i].idAgente}
                  );
                  
                  this.insertShowArray({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus});
                    this.adddProyect(json[i].idProyecto,json[i].nombreProyecto);
              }
            }
           
      });
  }


  getTicketsFlotante(){
    var json = {
        "idFlotante" : this.flotanteSelected
    };
    this.httpTickets.getTicketsFlotante(json).subscribe(
      datos => {
        this.arrayAllTickets = [];
        this.arrayShowTickets = [];
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
           
              for(var i = 0 ; i < json.length; i++){
                if(this.validarJson(json[i])){
                  this.arrayAllTickets.push({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus,
                    idAgente: json[i].idAgente}
                  );
                  
                  this.insertShowArray({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus});
                    this.adddProyect(json[i].idProyecto,json[i].nombreProyecto);
              }
            }
           
      });
  }

  getFlotantes(){
    var json ={
     
    }
    this.arrayFlotantes = [];
    this.httpTickets.getFlotantes(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = 0 ; i < json.length; i++){
                this.arrayFlotantes.push({ id: json[i].idingenieroflotante, 
                                          nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                            municipio: json[i].municipio, estado: json[i].estado, telefono: json[i].telefono, correo: json[i].email,
                                        });
             }
         
  });
  }


  cambioSelectProyecto(){
    console.log("");
    this.liderSelected = 0;
    this.agenteSelected = 0;
    this.checkPrioridad = 0;
    this.checkEstatus = 0;
    this.flotanteSelected = 0;


    this.getTicketsProyecto();
    this.getContadoresProyecto();

  }

  
  cambioSelectLider(){
    console.log("tgt");
    this.agenteSelected = 0;
    this.proyectoSelected = 0;
    this.flotanteSelected = 0;
    this.checkPrioridad = 0;
    this.checkEstatus = 0;
    this.getContadoresLider();
    this.getTicketsLider();
  }

  
  cambioSelectAgente(){
      this.liderSelected = 0;
      this.proyectoSelected = 0;
      this.flotanteSelected = 0;
      this.checkPrioridad = 0;
      this.checkEstatus = 0;
      this.getContadoresAgente();
      this.getTicketsAgente();
  }

  cambioSelectFlotante(){
    this.liderSelected = 0;
    this.proyectoSelected = 0;
    this.agenteSelected = 0;
    this.checkPrioridad = 0;
    this.checkEstatus = 0;

    this.getContadoresFlotante();
    this.getTicketsFlotante();
}

  cambioEsTatus(value: number){
    this.checkEstatus = value;
    console.log("estatus");
    this.checkPrioridad = 0;

    this.arrayShowTickets = [];
    if(this.checkEstatus == 0){
      for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          this.insertShowArray(this.arrayAllTickets[i]);  
      }
    }else{
      this.filtroEstatusPrioridad();
    }

  }

  cambioPrioridad(value: number){
    this.checkPrioridad =value;
    console.log(this.checkPrioridad);
    this.arrayShowTickets = [];
    if(this.checkPrioridad == 0){

      if(this.checkEstatus != 0){
        for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          if(this.arrayAllTickets[i].estado == this.checkEstatus){
            this.insertShowArray(this.arrayAllTickets[i]);
          }
      }
      }else{
        for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          this.insertShowArray(this.arrayAllTickets[i]);  
      }
      }
    }else{
      this.filtroEstatusPrioridad();      
    }



  }


insertShowArray(json: any){
  /*
  idTicket: number,
                          asunto: string,
                          proyecto: string, 
                          prioridad: number, 
                          estado: number}
  */

                                   
        let id = json.idTicket;
        let asunto = json.asunto;
        let proyecto = json.proyecto;

        let prioridad = "";
        switch(json.prioridad){
          case 1:
            prioridad = "Baja";
            break;
          case 2:
            prioridad = "Media";
            break;
          case 3:
            prioridad = "Alta";
            break;
          case 4:
            prioridad = "Incidente mayor";
            break;

        }
        let estado = "";
        switch(json.estado){
          case 1:
            estado = "Abierto";
            break;
          case 2:
            estado = "Pendiente";
            break;
          case 3:
            estado = "Resuelto";
            break;
          case 4:
            estado = "Cerrado";
            break;
          case 5:
            estado = "Reabierto";
              break;
        
        }


        this.arrayShowTickets.push({idTicket: id,
          asunto: asunto,
          proyecto: proyecto, 
          prioridad: prioridad, 
          estado: estado,
          idAgente: json.idAgente}); 
  
}

btnDetalle(ticket: any){
  console.log("ticket: "+ticket.idTicket);
  this.router.navigate(['/seguimiento', ticket.idTicket, "1"]);
}


filtroEstatusPrioridad(){
  this.arrayShowTickets = [];
   if(this.checkEstatus == 6){
      if(this.checkPrioridad != 0){
            for(var i = 0 ; i < this.arrayAllTickets.length; i++){
              if(this.arrayAllTickets[i].idAgente == 0 && this.arrayAllTickets[i].prioridad == this.checkPrioridad){
                this.insertShowArray(this.arrayAllTickets[i]);
              }
            }
      }else{
        for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          if(this.arrayAllTickets[i].idAgente == 0){
            this.insertShowArray(this.arrayAllTickets[i]);
          }
        }
      }
   }else{
    if(this.checkEstatus != 0 && this.checkPrioridad != 0){
      for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          if(this.arrayAllTickets[i].estado == this.checkEstatus && this.arrayAllTickets[i].prioridad == this.checkPrioridad){
            this.insertShowArray(this.arrayAllTickets[i]);
          }
      }
  }else{
      if(this.checkEstatus != 0){
        for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          if(this.arrayAllTickets[i].estado == this.checkEstatus){
            this.insertShowArray(this.arrayAllTickets[i]);
          }
      }
      }
      if(this.checkPrioridad != 0){
        for(var i = 0 ; i < this.arrayAllTickets.length; i++){
          if(this.arrayAllTickets[i].prioridad == this.checkPrioridad){
            this.insertShowArray(this.arrayAllTickets[i]);
          }
      }
      }
  }
   }


}


adddProyect(id: number , nombreProyecto : string){
  let agregar = true;
  for(var i = 0; i < this.arrayProyectos.length ; i++){
      if(this.arrayProyectos[i].idProyecto == id){
          agregar = false;
      }
  }

  if(agregar){
    this.arrayProyectos.push({idProyecto: id,
      idUsuario: this.sesion.idusuario,                      
      nombre:  this.sesion.nombre+" "+this.sesion.apPaterno+" "+this.sesion.apMaterno,
      nombreProyecto: nombreProyecto
    });
  }
}


descargarReporte(){

  this.httpTickets.getReporte().subscribe(
    datos => {
       var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json "+JSON.stringify(json));
          var jsonExel = [];
          for(var i = 0; i<json.length ; i++){
            
            
            
            var ticket = {
              "Folio" : json[i].ticket.folio,
              "Asunto" : json[i].ticket.asunto,
              "Descripcion" : json[i].ticket.descripcion,
              "Creado" : this.formatFechaReporte(json[i].ticket.fechaCreacion),
              "Fecha de cierre" : this.formatFechaReporte(json[i].ticket.fechaServicio),
              "Proyecto": json[i].ticket.proyectoNombre,
              "Tipo" : json[i].ticket.tipoTicket,
              "Estatus" : json[i].ticket.estatusticket,
              "Prioridad" : this.getNamePrioridad(json[i].ticket.prioridad),
              "Tipo de agente": this.tipoAgente(json[i].ticket.tipoAgente),
              "Nombre": json[i].nombre,
              "Estado" : json[i].ticket.Estado,
              "Municipio": json[i].ticket.municipio,
              "Direccion": json[i].ticket.asentamiento+", "+json[i].calle+". #"+json[i].numExterior,
              "Notas" : "",
              "Fecha de nota" : "",
              "Creada por": ""
            }

           if(this.validarJson(json[i].ticket)){
            jsonExel.push(ticket);
           }
       

           /* var notasJson = json[i].notas;
            for(var j = 0 ; j < notasJson.length ; j++){
              var ticketNota = {
                "Asunto" : "",
                "Descripcion" : "",
                "Creado" : "",
                "Proyecto": "",
                "Tipo" : "",
                "Estatus" : "",
                "Prioridad" : "",
                "Tipo de agente": "",
                "Nombre": "",
                "Estado" : "",
                "Municipio": "",
                "Direccion": "",
                "Notas" : notasJson[j].nota,
                "Tipo de nota": this.tipoNota(notasJson[j].tipoNota),
                "Fecha de nota" : notasJson[j].fechaNota,
                "Creada por": this.creadaNota(notasJson[j].creadaAgente) 
                
              }
              jsonExel.push(ticketNota);
            }*/
          }
              
           this.xlsServicio.exportAsExcelFile(jsonExel, 'reporte');

    });

 
}


getNamePrioridad(id: number){
  var nombre  = "";
  switch(id){
    case 1:
      nombre = "Baja";
      break;
    case 2:
      nombre = "Media";
      break;
    case 3:
      nombre = "Alta";
      break;
    case 4:
      nombre = "Incidente mayor";
      break;
  }
  return nombre;
}

tipoAgente(tipo: number){
  if(tipo == 0){
      return "Agente"
  }else{
    return "Flotante"
  }
}


creadaNota(creador : number){
    if(creador == 0){
      return "Dispatch";
    }else{
      return "Ingeniero";
    }
}

tipoNota(tipo : number){
  if(tipo == 0){
    return "Privada";
  }else{
    return "Publica";
  }
}




identificarUsuario(){
 this.liderSelected = 0;
 this.agenteSelected = 0;
 this.flotanteSelected = 0;
 this.proyectoSelected = 0 ;


  switch(this.sesion.idTipoUsuario){
      case 1:
      

        this.getAgentes();
        this.getLideres();
        this.getFlotantes();
        this.getProyectos();
        this.getAllContadores();
        this.getAllTickets();

        break;
      case 2:
        this.liderSelected = this.sesion.idusuario;
        this.getTicketsLider();
        this.getContadoresLider();
        this.getAgentes();
        this.getFlotantes();
        this.selectLideres = 0;
        
        break;
      case 3:
        this.getAgentes();
        this.getLideres();
        this.getFlotantes();
        this.getProyectos();
        this.getAllContadores();
        this.getAllTickets();
        break;
      case 4:
        this.selectLideres = 0;
        this.selectFlotantes = 0;
        this.selectAgentes = 0;
        this.agenteSelected = this.sesion.idusuario;;
        this.getTicketsAgente();
        this.getContadoresAgente();
        
        break;
      case 5:
        this.selectLideres = 0;
        this.selectFlotantes = 0;
        this.selectAgentes = 0;
        this.flotanteSelected =  this.sesion.idusuario;;
        this.getTicketsFlotante();
        this.getContadoresFlotante();

        break;
  }
}


  validarJson(json: any){
      let boolean = false;
      console.log("voy a validar "+JSON.stringify(json));
      switch(this.sesion.idTipoUsuario){
        case 1:
          boolean = true;
          break;
        case 2:
      
          this.liderSelected = this.sesion.idusuario;
          this.getContadoresLider();
          boolean = json.lider == this.liderSelected
          break;
        case 3:
          boolean = true;
          break;
        case 4:
          this.agenteSelected = this.sesion.idusuario;;
          this.getContadoresAgente();
          console.log("caso 4 en validacion + "+this.agenteSelected+" comparo con "+json.idAgente+" y "+json.tipoAgente);
            if(json.idAgente == this.agenteSelected && json.tipoAgente == 0){
              console.log("devlevo verdadero");
              boolean = true;
            }
          break;
        case 5:
          this.agenteSelected = this.sesion.idusuario;;
          this.getContadoresFlotante();
          if(json.idAgente == this.flotanteSelected && json.tipoAgente == 1){
            boolean = true;
          }
          break;
      }
      return boolean;
  }

  formatFechaReporte(fecha: string){
      if(fecha != null){
        return fecha.split("-").join("/");
        
      }else{
        return "";
      }
  }
  
  
}
