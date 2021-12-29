import { Component, OnInit } from '@angular/core';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { ActivatedRoute, Router } from '@angular/router';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';



@Component({
  selector: 'app-cu-proyecto',
  templateUrl: './cu-proyecto.component.html',
  styleUrls: ['./cu-proyecto.component.css']
})
export class CuProyectoComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  btnSLA = false;

  idUpdate=0;
  editables = false;

  disabled = false;
  maxBajo = 72;
  minBajo = 0;
  stepBajo = 1;
  maxMedio = 36;
  minMedio = 0;
  stepMedio = 1;
  maxAlto = 18;
  minAlto = 0;
  stepAlto = 1;
  maxUrgente = 10;
  minUrgente = 0;
  stepUrgente = 1;


  thumbLabel = true;
  prioridadBajo = 0;
  prioridadMedio = 0;
  prioridadAlto = 0;
  prioridadUrgente = 0;
  nombreProyecto = "";
  liderSelected = 0;

  fechaInicioPlaneacion = "";
  fechaFinPlaneacion = "";
  fechaInicioEjecucion = "";
  fechaFinEjecucion = "";

  costoTotalPlaneacion = 0;
  costoTotalEjecucion = 0;
  ingresoTotalPlaneacion = 0;
  ingresoTotalEjecucion = 0;
  utilidadPlaneacion = 0;
  utilidadEjecucion = 0;
  utilidadPorcentajePlaneacion = 0;
  utilidadPorcentajeEjecucion = 0;
  
  lunes = false;
  martes = false;
  miercoles = false;
  jueves = false;
  viernes = false;
  sabado = false;
  domingo = false;
  horaInicio = "";
  horaFin = "";

  arrayLideres:Array<{id: number,nombre: string, municipio: string, estado: string}>=[];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private httpTickets: ServiciosTicketsService,
              private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.idUpdate = Number(this.route.snapshot.paramMap.get("id"));

    console.log(this.idUpdate);
    if(this.idUpdate != -1){
      this.getdataProyecto();
      //this.getdataProyecto();
      this.getPrioridadesProyecto();
      this.editables = true;
      console.log("editar");
    }else{
      
      console.log("nuevo");
    }
    this.getPersonas();
  }


  getPersonas(){
    console.log("jeej");
    var json ={
      "idTipo" : 2
    }
    this.httpTickets.getPersonas(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = 0 ; i < json.length; i++){
                this.arrayLideres.push({ id: json[i].idusuario, 
                                          nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                            municipio: json[i].municipio, estado: json[i].estado,
                                        });
             }
         
  });
  }


  

guardarProyecto(){
  var json ={
    "nombreProyecto" : this.nombreProyecto,
    "idUsuario" : this.liderSelected,
    "bajo" : this.prioridadBajo,
    "medio" : this.prioridadMedio,
    "alto": this.prioridadAlto,
    "urgente": this.prioridadUrgente,
    "fechaFinPlaneacion" : this.convert(this.fechaFinPlaneacion),
    "fechaFinEjecucion" : this.convert(this.fechaFinEjecucion),
    "fechaInicioPlaneacion" : this.convert(this.fechaInicioPlaneacion),
    "fechaInicioEjecucion" : this.convert(this.fechaInicioEjecucion),
    "costoTotalPlaneacion" :   this.costoTotalPlaneacion,
    "costoTotalEjecucion" : this.costoTotalEjecucion,
    "ingresoTotalEjecucion" : this.ingresoTotalEjecucion,
    "ingresoTotalPlaneacion" : this.ingresoTotalPlaneacion,
    "utilidadPlaneacion" : this.utilidadPlaneacion,
    "utilidadEjecucion" : this.utilidadEjecucion,
    "utilidadPorcentajePlaneacion" : this.utilidadPorcentajePlaneacion,
    "utilidadPorcentajeEjecucion" : this.utilidadPorcentajeEjecucion,
    "diasHoras" : this.stringDias()+"|"+this.horaInicio+","+this.horaFin
    
  }

  console.log(json);
  this.httpTickets.setProyecto(json).subscribe(
    datos => {
   
       var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json "+JSON.stringify(json));

           if(json.status === "success"){
              console.log("guardado");
              this.router.navigate(['/proyectos']);

           }else{
            console.log("no guardado");
           }
    });
}
convert(str : string) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [date.getFullYear(), mnth,day].join("-");
}




btnSalir(){
    this.router.navigate(['/proyectos']);
}







getdataProyecto(){
  var json ={
    "idProyecto" : this.idUpdate
  }
  this.httpTickets.getProyecto(json).subscribe(
    datos => {
      console.log(JSON.stringify(datos)); 
      var json = JSON.parse(JSON.stringify(datos));
       
       
       
       this.liderSelected = json[0].lider;
       this.nombreProyecto = json[0].nombreProyecto;
       this.costoTotalPlaneacion = json[0].costoTotalPlaneacion;
       this.costoTotalEjecucion = json[0].costoTotalEjecucion;
       this.ingresoTotalEjecucion = json[0].ingresoTotalEjecucion;
       this.ingresoTotalPlaneacion = json[0].IngresoTotalPlaneacion;
       this.utilidadPlaneacion = json[0].utilidadPlaneacion;
       this.utilidadEjecucion = json[0].utilidadEjecucion;
       this.fechaInicioPlaneacion = json[0].fechaInicioPlaneacion;
       this.fechaFinPlaneacion = json[0].fechaFinPlaneacion;
       this.fechaInicioEjecucion = json[0].fechaInicioEjecucion;
       this.fechaFinEjecucion = json[0].fechaFinEjecucion;
       this.encodeStringDias(json[0].diashoras);

});
}

/*
     "idproyectoCuenta": 20,
 
        "fechaInicioPlaneacion": "2021-05-17T05:00:00.000Z",
        "fechaInicioEjecucion": "2021-05-31T05:00:00.000Z",
        "fechaFinPlaneacion": "2021-05-24T05:00:00.000Z",
        "fechaFinEjecucion": "2021-05-24T05:00:00.000Z",
      
        "utilidadPorcentajePlaneacion": 0,
        "utilidadPorcentajeEjecucíon": null
*/ 

getPrioridadesProyecto(){
  var json ={
    "idProyecto" : this.idUpdate
  }
  this.httpTickets.getPrioridadProyecto(json).subscribe(
    datos => {
       var json = JSON.parse(JSON.stringify(datos));
       for(var i = 0 ; i < json.length; i++){
         switch(json[i].tipo){
            case 1:
              this.prioridadBajo = json[i].tiempoVida
              break;
            case 2:
              this.prioridadMedio = json[i].tiempoVida
              break;
            case 3:
              this.prioridadAlto = json[i].tiempoVida
              break;
            case 4:
              this.prioridadUrgente = json[i].tiempoVida
                break;  
         }
       }
});
}




actualizarSLAs(){
  console.log(this.stringDias()+"|"+this.horaInicio+","+this.horaFin)  

var json = {
  "idProyecto" : this.idUpdate,
  "prioridadBajo" : this.prioridadBajo,
  "prioridadMedia" : this.prioridadMedio,
  "prioridadAlta" : this.prioridadAlto,
  "prioridadUrgente" : this.prioridadUrgente,
  "diasHoras": this.stringDias()+"|"+this.horaInicio+","+this.horaFin
}
this.httpTickets.updateProyectoSLAs(json).subscribe(
    datos => {
   
       var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json "+JSON.stringify(json));

           if(json.status === "success"){
              console.log("guardado");
              this.openSnackBar("SLA´s guardados");

           }else{
            console.log("no guardado");
            this.openSnackBar("Ocurrio un error al guardar los SLA´s");
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

stringDias(){
  var string = "";
  if(this.domingo){
    string = string+"1";
  }else{
    string = string+"0";
  }
  if(this.lunes){
    string = string+"1";
  }else{
    string = string+"0";
  }
  if(this.martes){
    string = string+"1";
  }else{
    string = string+"0";
  }
  if(this.miercoles){
    string = string+"1";
  }else{
    string = string+"0";
  }
  if(this.jueves){
    string = string+"1";
  }else{
    string = string+"0";
  }
  if(this.viernes){
    string = string+"1";
  }else{
    string = string+"0";
  }
  if(this.sabado){
    string = string+"1";
  }else{
    string = string+"0";
  }
  return string;
  
}

encodeStringDias(cadena: string){
  var vec = cadena.split("|");
  var dias = vec[0].split("");
  var horas = vec[1].split(",");
  if(dias[0] === "1"){
    this.domingo = true;
  }else{
    this.domingo = false;
  }
  if(dias[1] === "1"){
    this.lunes = true;
  }else{
    this.lunes = false;
  }
  if(dias[2] === "1"){
    this.martes = true;
  }else{
    this.martes = false;
  }
  if(dias[3] === "1"){
    this.miercoles = true;
  }else{
    this.miercoles = false;
  }
  if(dias[4] === "1"){
    this.jueves = true;
  }else{
    this.jueves = false;
  }
  if(dias[5] === "1"){
    this.viernes = true;
  }else{
    this.viernes = false;
  }
  if(dias[6] === "1"){
    this.sabado = true;
  }else{
    this.sabado = false;
  }
  this.horaInicio = horas[0];
  this.horaFin = horas[1];
  
}

}
