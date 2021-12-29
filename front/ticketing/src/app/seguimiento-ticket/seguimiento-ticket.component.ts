import { Component, OnInit } from '@angular/core';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; // Importar
import * as moment from 'moment';
import { saveAs } from 'file-saver';
import firebase from "firebase/app";
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';


import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';



@Component({
  selector: 'app-seguimiento-ticket',
  templateUrl: './seguimiento-ticket.component.html',
  styleUrls: ['./seguimiento-ticket.component.css']
})
export class SeguimientoTicketComponent implements OnInit {

  
  tiempoUrgente = 0;
  titleDestino = 'Destino';
  
  mesajeCheckfiles = "";

  firebaseConfig = {
    databaseURL: "https://ticketing-6df47-default-rtdb.firebaseio.com/",
    apiKey: "AIzaSyBjU2RMJqvPgsYxe9qVkNbfHurLrZAzUOs",
    authDomain: "ticketing-6df47.firebaseapp.com",
    projectId: "ticketing-6df47",
    storageBucket: "ticketing-6df47.appspot.com",
    messagingSenderId: "660899398781",
    appId: "1:660899398781:web:8af3f6700f2b200faedd14"
  };




  title = 'prubaMapa';
  points: point[] = [];
    // google maps zoom leve
  zoom = 16;  



    currentPos: point = {
      lat: 0,
      lng: 0
    };
    lugarDestino: point = {
      lat: 0,
      lng: 0
    };
    agentePos: point = {
      lat: 0,
      lng: 0
    };
    tutorial : any;



    arrayEstatus:Array<{nombre : string, value: number}>=[]
    



  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  asuntoguardado = "1";
  prioridadguardado = "1";
  estatusGuardado = "1";
  asignadoGuardado = "1";
  conceptoGasto = "";
  cantidadGasto = 0;
  pagadoGasto = 0;
  idAgenteSelected = 0;
  tipoAsignado =0;

  pantalla= 0;

  idFlotante = 0;

  tipoSelected = 0;
  nuevaNota = "";
  estatusSelected =0;
  nombreCreador = "";
  fechaCreacion = "";
  asunto = "";
  nombreProyecto = "";
  idEstatus = 0;
  nombreAgente = "";
  tipoTicket = "";
  idTicket = 0;
  prioridad = "";
  descripcion = "";
  folio = "";
  justificacionPendiente = "";
  horaPendiente = "";
  fechaPendiente = "";

  arrayFileUpload:Array<{File : any, Descripcion: string}>=[];
  arrayFiles:Array<{ id:number, nombreArchivo : string , descripcion: string, fecha: string, path : string, evidenciaAgente: number}>=[];

  arrayGastos:Array<{ id:number, concepto : string , cantidad : number, pagado: boolean}>=[];


  arrayAgentes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string, tipo: number, nombreTipo: string}>=[];
  arrayFlotantes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string, tipo: number, nombreTipo: string}>=[];
  arrayShow:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string, tipo: number, nombreTipo: string}>=[];

  



  arrayNotas:Array<{idNota: number ,fecha: string, tipo: string, nota: string; creadaAgente : number}>=[];
  constructor(config: NgbModalConfig, private modalService: NgbModal,private _snackBar: MatSnackBar,private httpTickets: ServiciosTicketsService, private route: ActivatedRoute,
    private router: Router) { 
      
      config.backdrop = 'static';
      config.keyboard = false;
      
      this.idTicket = Number(this.route.snapshot.paramMap.get("idTicket"));
      this.pantalla = Number(this.route.snapshot.paramMap.get("pantalla"));
     

      this.getInfoTicket();
      this.getDatafiles();
      this.getGastos();
      if(!firebase.apps.length){
        firebase.initializeApp(this.firebaseConfig);
      }
      this.getDataFirebase();

    }

  ngOnInit(): void {
  }

  getInfoTicket()
  {
    var json ={
      "idTicket" : this.idTicket 
    }


    this.httpTickets.getTicket(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
        console.log(JSON.stringify(json));
        var data = json.data;
        var notas = json.notas;
        this.estatusSelected = data.idEstatus;
        this.fechaCreacion = this.formatDate(data.fechaCreacion.toString());
        this.getDataCreacion(data.idCreador);
        this.asunto = data.asunto;
        this.nombreProyecto = data.nombreProyecto;
        this.tipoTicket = data.nombre;
        this.prioridad = data.tipo;//this.getNamePrioridad(data.tipo);
        this.descripcion = data.descripcion;
        this.tipoAsignado = data.tipoAgente;
        this.lugarDestino.lat = data.lat;
        this.lugarDestino.lng = data.lng;
        this.currentPos.lat = data.lat;
        this.currentPos.lng = data.lng;
        this.folio = data.folio;
        this.tiempoUrgente = data.tiempoUrgente;
        
      
        this.llenarArrayEstatus(this.estatusSelected);
        if(data.idAgente == 0){
            this.nombreAgente ="No asignado";
        }else{
          if(this.tipoAsignado){

            this.getDataFlotante(data.idAgente);
            this.idFlotante = data.idAgente;
          }else{
            
            this.getDataAgente(data.idAgente);
        
          }
        }

        this.getPersonas();
        this.getFlotantes();
        this.arrayNotas = [];
        for(var i = notas.length-1 ; i >= 0 ; i--){   
          
          let fechaFormat = this.formatDate(notas[i].fechaNota.toString().replace("T", " "));
          let tipo = "Privada";
          if(notas[i].tipoNota == 1){
            tipo = "Pública"
          }


        this.arrayNotas.push({idNota: notas[i].idNotaTicket,fecha: fechaFormat, tipo: tipo , nota: notas[i].nota, creadaAgente : notas[i].creadaAgente});
        }
        this.calcularTiempo(this.fechaCreacion, data.tiempoVida);
       
  });
  }



  getDataCreacion(id : number){

    var json ={
      "idUsuario" : id
    }
  
    this.httpTickets.getPersona(json).subscribe(
         datos => {
            var json = JSON.parse(JSON.stringify(datos));
            
                console.log(json+" esto en json "+JSON.stringify(json));
                
                this.nombreCreador = json[0].nombre+" "+json[0].apPaterno+" "+json[0].apMaterno; 
              
  
  
              });
  }

  
  getDataAgente(id : number){
    var json ={
      "idUsuario" : id
    }
    this.httpTickets.getPersona(json).subscribe(
         datos => {
            var json = JSON.parse(JSON.stringify(datos));
            
                console.log(json+" esto en json "+JSON.stringify(json));
                
                this.nombreAgente = json[0].nombre+" "+json[0].apPaterno+" "+json[0].apMaterno; 
                
  
  
  
              });
  }
  
  getPersonas(){
    var json ={
      "idTipo" : 4
    }
    this.httpTickets.getPersonas(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = 0 ; i < json.length; i++){
                this.arrayAgentes.push({ id: json[i].idusuario, 
                                         nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                         municipio: json[i].municipio, 
                                         estado: json[i].estado, 
                                         telefono: json[i].telefono, 
                                         correo: json[i].email, 
                                         tipo: 0, 
                                         nombreTipo: "Agente"
                                        });
             }
             if(!this.tipoAsignado){
              
                  for(var i = 0 ; i < this.arrayAgentes.length; i++){
                    this.arrayShow.push(this.arrayAgentes[i]);
                }
             }
         
  });
  }


  updateTicket(){

    var json ={
      "idTicket" : this.idTicket,
      "asunto": this.asunto,
      "estatus": this.estatusSelected,
      "asignado": Number(this.idAgenteSelected),
      "tipoAsignado" : this.tipoAsignado,
      "prioridad" : this.prioridad,
      "fechaPendiente" : this.fechaPendiente+" "+this.horaPendiente,
      "tiempoUrgente" : this.tiempoUrgente
    };

console.log("esto mando "+JSON.stringify(json));
    this.httpTickets.updateTicket(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json update "+JSON.stringify(json));
          if(json.status == "success"){
            this.getInfoTicket();
            this.resetGuardados();
          }else{

          }
  });

  }


  agregarNota(){
    var json ={
      "idTicket" : this.idTicket,
      "nota": this.nuevaNota,
      "tipo": this.tipoSelected,
      "creadaAgente": 0
    }
    this.httpTickets.addNota(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
          if(json.status == "success"){
            this.getInfoTicket();
            this.nuevaNota = "";
            this.openSnackBar("Nota agregada");
          }else{
            this.openSnackBar("Error al agregar la nota");
          }
  });
  }


  eliminarNota(nota: any){
    var json ={
      "idNotaTicket" : nota.idNota 
    };
    this.httpTickets.deleteNota(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
          if(json.status == "success"){
            this.getInfoTicket();
            this.nuevaNota = "";
            this.openSnackBar("Nota borrada");
          }else{
            this.openSnackBar("Error al borrar la nota");
          }
  });
  }

formatDate(fecha: string){
    let date = fecha.split(":")[0]+":"+fecha.split(":")[1];
    return date;
}



btnSalir(){
  if(this.pantalla == 3){
    this.router.navigate(['/ticketsFlotante', this.idFlotante]);
  }else{
    this.router.navigate(['/tickets',0]);
  }
  
}




getNamePrioridad(prioridad: number){
  let namepri = "";
  switch(prioridad){
    case 1:
      namepri = "Bajo";
      break;
    case 2:
      namepri = "Medio";
      break;
    case 3:
      namepri = "Alto";
      break;
    case 4:
      namepri = "Incidente mayor";
      break; 
  }
  return namepri;
}


calcularTiempo(fechaCreacion : string, horas: number){
  console.log(horas);
  var fecha1 = moment(fechaCreacion+":00", "YYYY-MM-DD HH:mm:ss");
  var fechaEstimada = fecha1.add(horas, "h");
  this.prioridad = this.prioridad;//""+fechaEstimada.format('YYYY-MM-DD HH:mm');
}


cambioAsunto(){
  this.asuntoguardado = "0";
}


cambioEstatus(){
  this.estatusGuardado = "0";
}

cambioPrioridad(content3 : any){
  if(Number(this.prioridad) == 4){
    this.modalService.open(content3);
  }
  else{
    this.tiempoUrgente = 0;
  }
  this.prioridadguardado = "0";
}

cancelarEstatusUrgente(){
  this.getInfoTicket();
  this.modalService.dismissAll();
}



cambioAsignado(){
  this.asignadoGuardado = "0";
}


resetGuardados(){
  this.asignadoGuardado = "1";
  this.asuntoguardado = "1";
  this.prioridadguardado = "1";
  this.estatusGuardado = "1";
}

listaDeArchivos(files :any){
 
  console.log(files.target.files);

  for(var i = 0 ; i < files.target.files.length; i++){
    let extension =  files.target.files[i].name.split(".")[files.target.files[i].name.split(".").length-1];
    if(extension == "docx" || extension == "xlsx" || extension == "csv" || extension == "pptx" || 
       extension == "pptm" || extension == "docx" || extension == "pdf" || extension == "zip"  ||
       extension == "rar"  || extension == "docx" || extension == "mpp" || extension == "docx" ||
       extension == "vsd"  || extension == "vsdx" || extension == "xlsb"  || 
       extension == "pub" || extension == "vsd"  ||  extension == "msg"|| extension == "eml" ||
       extension == "jpg"  || extension == "jpeg"  || extension == "png" || extension == "tiff"  ||
       extension == "tif"  || extension == "raw"  || extension == "bmp" || extension == "eps"){
        this.arrayFileUpload.push({File: files.target.files[i], Descripcion: "" })  
    }else{
      this.openSnackBar("Tipo de archivo ("+extension+") no soportado");
    }



  }

 /* this.httpTickets.uploadArchivos(files.target.files[0], "").subscribe(
    datos => {
       var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json update "+JSON.stringify(json));
        if(json.status == "success"){
          console.log("Se subieron");
        }else{

          console.log("no se subieron");
        }
});*/
  
}

uploadFiles(){

  var subidos = 0;
  for(var i = 0; i < this.arrayFileUpload.length ; i++){
    var json = {
      "idTicket" : this.idTicket,
      "descripcion" : this.arrayFileUpload[i].Descripcion,
      "evidenciaAgente" : 0
    };


    this.httpTickets.uploadArchivos(this.arrayFileUpload[i].File,json ).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json update "+JSON.stringify(json));
          if(json.status == "success"){
            console.log("Se subieron");
            subidos++;
            if(subidos == this.arrayFileUpload.length ){
              this.getDatafiles();
              this.arrayFileUpload = [];
            }
          
          }else{
  
            console.log("no se subieron");
          }
    });
  }
}


getFile(archivo: any){
  var json = {
    "namePath" : archivo.path
};
    this.httpTickets.getFile(json).subscribe(
      datos => {
        //var json = JSON.parse(JSON.stringify(datos));
        console.log(datos);
        
        
        
        datos.arrayBuffer().then(buffer =>{
          console.log(buffer);
      
          
        });
          datos.text().then(text => {console.log("texto blob"); console.log(text)});
          console.log(datos.type+" "+datos.text()+" "+datos.stream().getReader()+" esto en json update ");
          saveAs(datos, archivo.nombreArchivo);
          
  });
}

getAllFiles(){
  for(var i = 0 ; i < this.arrayFiles.length ; i++){
        var json = {
          "namePath" : this.arrayFiles[i].path
      };
          this.httpTickets.getFile(json).subscribe(
            datos => {
              //var json = JSON.parse(JSON.stringify(datos));
                console.log(datos.toString()+" esto en json update ");
                saveAs(datos, this.asunto+" evidencia");
                
        });
  }
}


getDatafiles(){ 
  var json = {
    "idTicket": this.idTicket
  };
  this.httpTickets.getDataFile(json).subscribe(
    datos => {       
      
      var json = JSON.parse(JSON.stringify(datos));
      this.arrayFiles = [];
      console.log(JSON.stringify(json));
      for(var i = 0 ; i < json.length ; i++){
       // { id:number, nombreArchivo : string , descripcion: string, fecha: string, path : string}

        let nombreArchivo = this.deleteIdName(json[i].nombreArchivo); 
        let fechaString = json[i].fechaDeSubida.split("T")[0];
        this.arrayFiles.push({ id: json[i].idEvidencia, nombreArchivo : nombreArchivo, descripcion: json[i].descripcion, fecha: fechaString, path : json[i].pathArchivo, evidenciaAgente : json[i].evidenciaAgente});
      }
        
  });

}


deleteFile(archivo: any){
  var json = {
    "idEvidencia" : archivo.id,
    "namePath" : archivo.path
  };
    this.httpTickets.deleteFile(json).subscribe(
      datos => {
        //var json = JSON.parse(JSON.stringify(datos));
        var json = JSON.parse(JSON.stringify(datos));
        console.log(json+" esto en json update "+JSON.stringify(json));
     if(json.status == "success"){
       console.log("Se subieron");
       this.getDatafiles();
     }else{

       console.log("no se subieron");
     }
  });

}

quitUploadFile(File : File){
  for(var i = 0 ; i < this.arrayFileUpload.length ; i++){
    if(this.arrayFileUpload[i].File.name == File.name){
      this.arrayFileUpload.splice(i, 1);
    }
  }

}

getGastos(){ 
  var json = {
    "idTicket": this.idTicket
  };
  this.httpTickets.getGastos(json).subscribe(
    datos => {       
      
      var json = JSON.parse(JSON.stringify(datos));
      this.arrayGastos = [];
      console.log(JSON.stringify(json));
      for(var i = 0 ; i < json.length ; i++){
       // { id:number, nombreArchivo : string , descripcion: string, fecha: string, path : string}

        this.arrayGastos.push({ id: json[i].idGastoTickes, concepto : json[i].concepto, cantidad : json[i].cantidad, pagado: json[i].pagado});
      }
        
  });

}


nuevoGasto(){

  var json = {
    "idTicket": this.idTicket,
    "cantidad": this.cantidadGasto,
    "concepto": this.conceptoGasto,
    "pagadoGasto" : false
  };
  this.httpTickets.setGastos(json).subscribe(
    datos => {       
      var json = JSON.parse(JSON.stringify(datos));
     if(json.status == "success"){
        this.getGastos();
     }else{

     }
        
  });

}



getFlotantes(){
  var json ={  
  }
  this.httpTickets.getFlotantes(json).subscribe(
    datos => {
       var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json "+JSON.stringify(json));
           for(var i = 0 ; i < json.length; i++){
              this.arrayFlotantes.push({ id: json[i].idingenieroflotante, 
                                        nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                          municipio: json[i].municipio, 
                                          estado: json[i].estado, 
                                          telefono: json[i].telefono, 
                                          correo: json[i].email,
                                          tipo: 1, nombreTipo: "Flotante"
                                      });
           }
       
           if(this.tipoAsignado){
            for(var i = 0 ; i < this.arrayFlotantes.length; i++){
              this.arrayShow.push(this.arrayFlotantes[i]);
          }
           }
          
});
}

openSnackBar(mensaje: string) {
  this._snackBar.open(mensaje, '', {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    duration:  1500,
  });
}


cambioSwitch(){
  console.log(this.tipoAsignado);
  this.arrayShow = [];
  if(!this.tipoAsignado){
    console.log("Flotantes");
    for(var i = 0 ; i < this.arrayFlotantes.length; i++){
        this.arrayShow.push(this.arrayFlotantes[i]);
    }
  }else{
    console.log("agentes");
    for(var i = 0 ; i < this.arrayAgentes.length; i++){
      this.arrayShow.push(this.arrayAgentes[i]);
  }
  }
}




getDataFlotante(id: number){
  var json ={
    "idIng" : id
  }

  this.httpTickets.getFlotante(json).subscribe(
       datos => {
          var json = JSON.parse(JSON.stringify(datos));
          
              console.log(json+" esto en json "+JSON.stringify(json));
              //this.userName = json[0].userName;

              this.nombreAgente = json[0].nombre+" "+json[0].apPaterno+" "+json[0].apMaterno; 

            });
}

getDataFirebase(){
  console.log('Tickets/'+this.idTicket+"/coordenadas");
  var starCountRef = firebase.database().ref('Tickets/'+this.idTicket+"/coordenadas");
  starCountRef.on('value', (snapshot) => {
    const data = snapshot.val();
    console.log("value de firebase");
    console.log(data+" "+JSON.stringify(data));
    var point = {
      lat: data.latActual,
      lng: data.logActual
    };
    this.points = [];
    this.points.push(point);


    //updateStarCount(postElement, data);
  });
}



verAgente(){
  this.zoom = 16;
  this.currentPos.lat = this.points[this.points.length-1].lat;
  this.currentPos.lng = this.points[this.points.length-1].lng;
  
}

verDestino(){
  
  this.zoom = 16;
  this.currentPos.lat = this.lugarDestino.lat;
  this.currentPos.lng = this.lugarDestino.lng ;

}


deleteIdName(name: string){
  var array = name.split("_");
  var nombre = "";
  if(array.length > 2){
    for(var i = 2; i < array.length ; i++ ){      
      nombre = nombre+"_"+array[i];
    }
    nombre = array[1]+nombre;
  }else if(array.length == 2){
    nombre = array[1];
  }else{
    nombre = name;
  }
  
  return nombre;
}

open(content:any,content2:any) {
  if(this.estatusGuardado === "0" && this.estatusSelected == 4){
    this.validarDocumentos();
    this.modalService.open(content);
  }else if(this.estatusGuardado === "0" && this.estatusSelected == 2){
    this.modalService.open(content2);
  }else{
    this.updateTicket();
  }
}

cerrarTicketModal(){
  this.modalService.dismissAll();
  this.updateTicket();
}


pendienteTicketModal(){
  if(this.validacionPendiente()){
    this.updateTicket();
    this.tipoSelected == 1;
    this.nuevaNota = "El ticket se puso pendiente para el día "+  this.fechaPendiente+" "+this.horaPendiente.substring(0,5) +", justificación: "+ this.justificacionPendiente;
    this.justificacionPendiente = "";
    this.agregarNota();
    this.modalService.dismissAll();
  }
}


validarDocumentos(){
  if(this.arrayFiles.length == 0){
    this.mesajeCheckfiles = "El ticket no tiene ningun archivo en evidencias, ¿Seguro que lo quieres cerrar?"
  }else{
    this.mesajeCheckfiles = "¿Los archivos que estan en evidencias son suficientes para cerrar el ticket?"
  }
}



validacionPendiente(){
  if(this.justificacionPendiente === ""){
    this.openSnackBar("Ingresa una justificación");
    return false;
  }else if(this.fechaPendiente === ""){
    this.openSnackBar("Ingresa una fecha de reprogramación");
    return false;
  }else if(this.horaPendiente === ""){
    this.openSnackBar("Ingresa una hora de reprogramación");
    return false;
  }else{
    //console.log(this.fechaPendiente);
    console.log(this.fechaPendiente+" "+this.horaPendiente);
    this.horaPendiente = this.horaPendiente+":00.00" 
    return true;
  }
  
}


llenarArrayEstatus(estatus:number){
  this.arrayEstatus = [];
  switch(estatus){
    case 1:
      this.arrayEstatus.push({nombre: "Abierto", value: 1});
      this.arrayEstatus.push({nombre: "Pendiente", value: 2});
      this.arrayEstatus.push({nombre: "Resuelto", value: 3});  
      break;
    case 2: 
      this.arrayEstatus.push({nombre: "Pendiente", value: 2});
      this.arrayEstatus.push({nombre: "Abierto", value: 1});
    break;
    case 3:
      this.arrayEstatus.push({nombre: "Resuelto", value: 3});
      this.arrayEstatus.push({nombre: "Cerrado", value: 4});  
      this.arrayEstatus.push({nombre: "Re-abierto", value: 5});
    break;
    case 4:   
      this.arrayEstatus.push({nombre: "Cerrado", value: 4});
      this.arrayEstatus.push({nombre: "Re-abierto", value: 5});
      break;
    case 5:
      this.arrayEstatus.push({nombre: "Re-abierto", value: 5});
      this.arrayEstatus.push({nombre: "Pendiente", value: 2});
      this.arrayEstatus.push({nombre: "Resuelto", value: 3});
    break;
  }
  
  
}


updatePrioridasUrgente(){
  if(this.tiempoUrgente > 0){
      this.modalService.dismissAll();
      this.updateTicket();
  }else{
      this.openSnackBar("ingresa las horas de atención el cliente");
  }
}



}

interface point {
  lat: number;
  lng: number;
}
