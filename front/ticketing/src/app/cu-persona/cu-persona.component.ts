import { Component, Inject, OnInit } from '@angular/core';
import { ApisepomexService } from "../servicios/apisepomex.service";
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; // Importar
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';



@Component({
  selector: 'app-cu-persona',
  templateUrl: './cu-persona.component.html',
  styleUrls: ['./cu-persona.component.css']
})
export class CuPersonaComponent implements OnInit {

  userNameValidado = false;
  updateid = -1;
  idPersonaDatos = 0;
  editable = false;
  tituloAccion = "";
  titleButton = "";
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
/**/
  
  tipoPersona: number = 0;
  tipoPersonaNombre: string = "Agente";
  codePostal:string ="";
  municipio:string ="";
  estado:string ="";
  calle: string = "";
  asentamiento: string = "Selecciona...";
  asentamientoOtro:string= "";

  numExterior: string = "";
  numInterior: string = "";
  pass:string = "";
  pass2:string = "";
  nombrePersona: string = "";
  apPaterno: string = "";
  apMaterno: string = "";
  telefono: string = "";
  email:string="";
  idTipoUsuario: number = 4;

  arrayAsentamientos:Array<{nombre: string, tipo: string, cadena: string}>=[];


  constructor(private route: ActivatedRoute
              ,private router: Router,
              private _snackBar: MatSnackBar,
              private httpSepomex: ApisepomexService
              ,private httpTickets: ServiciosTicketsService) { 

              }

  ngOnInit(): void {
    this.updateid = Number(this.route.snapshot.paramMap.get("id"));
    this.idTipoUsuario = Number(this.route.snapshot.paramMap.get("tipo"));
    if(this.updateid >= 0){
      console.log("actualizo a id "+this.updateid);
      this.editable = true;
      this.tituloAccion = "Actualizar";
      this.titleButton = "Actualizar"
      this.getDataPersona();
    }else{
      console.log("nuevo");
      this.titleButton = "Guardar"
      this.tituloAccion = "Nuevo";
    }
    switch(this.idTipoUsuario){
      case 1: this.tipoPersonaNombre = "Administrador";
      break;
      case 2: this.tipoPersonaNombre = "Lider";
      break;
      case 3: this.tipoPersonaNombre = "Dispatch";
      break;
      case 4: this.tipoPersonaNombre = "Agente";
      break;
  }
  }

  getInfoCp(){
    console.log("hola desde busqueda de cp con "+this.codePostal+" "+this.codePostal.toString().length);
    if(this.codePostal.toString().length >= 4){
      this.httpSepomex.getInfoCodePostal(this.codePostal).subscribe(
        datos => {
          var json = JSON.parse(JSON.stringify(datos));
          this.arrayAsentamientos = [];
            console.log(json+" esto en json "+JSON.stringify(json));
            for(var i = 0 ; i < json.length; i++){
                let jsonAsentamiento = json[i];
                this.municipio = jsonAsentamiento.Municipio;
                this.estado = jsonAsentamiento.Estado;
                console.log(i+" "+jsonAsentamiento);
                this.arrayAsentamientos.push({nombre: jsonAsentamiento.Colonia,tipo: jsonAsentamiento.Tipo_Asentamiento, cadena: jsonAsentamiento.Colonia +" - "+jsonAsentamiento.Tipo_Asentamiento });
            }
        },
        error => {
            this.openSnackBar("Código postal incorrecto");
            this.arrayAsentamientos = [];
            this.estado = "";
            this.municipio = "";
        }
        
        
        );
    }else{
      this.arrayAsentamientos = [];
      this.estado = "";
      this.municipio = "";
    }
 }



saveData(){
  if(this.validarDatos()){
  

    var json = {
      "idPersonaDatos": this.idPersonaDatos,
      "userName" : this.email,
      "pass": this.pass,
      "idTipoUsuario" : this.idTipoUsuario,
      "nombrePersona" : this.nombrePersona,
      "apPaterno": this.apPaterno,
      "apMaterno": this.apMaterno,
      "telefono" : this.telefono,
      "email" : this.email,
      "estado": this.estado,
      "municipio": this.municipio,
      "calle" : this.calle,
      "numExterior": this.numExterior,
      "numInterior": this.numInterior,
      "colonia" : this.asentamiento,
      "cp" : this.codePostal
    };
  
    if(this.updateid > 0){
      this.httpTickets.updateAgente(json).subscribe(
        datos => {
           var json = JSON.parse(JSON.stringify(datos));
           if(json.status === "success"){
               this.openSnackBar("Listo");
               if(this.asentamiento.split("|").length == 2){
                this.asentamientoOtro = this.asentamiento.split("|")[1];
                this.asentamiento = this.asentamiento.split("|")[0];
              }else{
                this.asentamientoOtro = "";
              }

           }else{
             this.openSnackBar("Error, intenta más tarde");
           }
               console.log(json+" esto en json "+JSON.stringify(json)); 
             });
  
    }else{
  console.log(this.asentamiento);
  this.httpTickets.setPersona(json).subscribe(
       datos => {
          var json = JSON.parse(JSON.stringify(datos));
          if(json.status === "success"){
              this.openSnackBar("Registro exitoso");
              if(this.updateid == -2){
                this.router.navigate(['/personas', this.idTipoUsuario]);
              }else {
                this.router.navigate(['/proyecto',-1]);
              }
      
          }else{
            this.openSnackBar("Error, intenta más tarde");
          }
              console.log(json+" esto en json "+JSON.stringify(json)); 
            });
    }
  }


  
}


openSnackBar(mensaje: string) {
  this._snackBar.open(mensaje, '', {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    duration:  1500,
  });
}

getDataPersona(){

  console.log(this.asentamiento);
  var json ={
    "idUsuario" : this.updateid
  }

  this.httpTickets.getPersona(json).subscribe(
       datos => {
          var json = JSON.parse(JSON.stringify(datos));
          
              console.log(json+" esto en json "+JSON.stringify(json));
              //this.userName = json[0].userName;
          
              this.idTipoUsuario = json[0].idTipoUsuario;
              this.nombrePersona = json[0].nombre;
             this.apPaterno = json[0].apPaterno;
              this.apMaterno =  json[0].apMaterno;
              this.telefono =  json[0].telefono;
              this.email = json[0].email;
             this.estado = json[0].estado;
            this.municipio = json[0].municipio;
             this.calle = json[0].calle;
            this.numExterior = json[0].numExterior;
             this.numInterior = json[0].numInterior;
            this.asentamiento = json[0].colonia;

            if(this.asentamiento.split("|").length == 2){
              this.asentamientoOtro = this.asentamiento.split("|")[1];
              this.asentamiento = this.asentamiento.split("|")[0];
            }
              this.codePostal = json[0].cp+"";
              this.idPersonaDatos = json[0].idPersonaDatos;
              this.getInfoCp();

              console.log("asentamiento: "+this.asentamiento);


            });
}


userNameValido(){
var json = {
  "userName" : this.email
};
 this.httpTickets.buscarUserName(json).subscribe(
    datos => {
       var json = JSON.parse(JSON.stringify(datos));
       console.log(json+" esto en json "+JSON.stringify(json)); 
      if(json.length != 0){
        this.openSnackBar("userName no disponible");
        this.userNameValidado = false;
      }else{
        this.userNameValidado = true;
      }
    });
}

validarDatos(){





    if(this.updateid < 0){
      if(!this.userNameValidado || this.email == ""){
        this.openSnackBar("Ingresa un correo valido");
        return false;
      }else if(this.pass.length < 8){
        this.openSnackBar("ingresa tu contraseña (minimo 8 caracteres)");
        return false;
      }else if(this.pass != this.pass2){
        this.openSnackBar("Las contraseñas no empatan");
        return false;
      }
    }
     if(this.nombrePersona === ""){
      this.openSnackBar("Ingresa el nombre");
      return false;
    }else if(this.apPaterno === ""){
      this.openSnackBar("Ingresa el apellido paterno");
      return false;
    }else if(this.apMaterno === ""){
      this.openSnackBar("Ingresa el apellido materno");
      return false;
    }else if(this.telefono.toString().length != 10){
      console.log("el tamaño de numero es "+this.telefono.toString().length+" ");
      console.log(this.telefono);
      this.openSnackBar("Ingresa telefono a 10 dígitos");
      return false;
    }else if(this.estado ===  ""){
      this.openSnackBar("Ingresa codigo postal valido");
      return false;
    }else if(this.municipio === ""){
      this.openSnackBar("Ingresa codigo postal valido");
      return false;
    }else if(this.asentamiento === "Selecciona..." || this.asentamiento === ""){
      this.openSnackBar("selecciona un asentamiento");
      return false;
    }else if(this.calle === ""){
      this.openSnackBar("Ingresa calle");
      return false;
    }
    else if(this.numExterior === ""){
      this.openSnackBar("Ingresa número exterior");
      return false;
    }
    else if(this.asentamiento === "Otro"){
      if(this.asentamientoOtro === ""){
        this.openSnackBar("especifica el asentamiento");

   
          return false;
      }
      else{
        this.asentamiento=this.asentamiento +"|"+this.asentamientoOtro
        return true;
      }
    } 
    else{
      return true;
    }

}


btnSalir(){


  if(this.updateid == -2){
    this.router.navigate(['/personas', this.idTipoUsuario]);
  }else if(this.updateid == -1){
    this.router.navigate(['/proyecto',-1]);
  }else{

    this.router.navigate(['/personas', this.idTipoUsuario]);
  }

}
}



