import { Component, OnInit } from '@angular/core';
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
  selector: 'app-nuevoflotante',
  templateUrl: './nuevoflotante.component.html',
  styleUrls: ['./nuevoflotante.component.css']
})
export class NuevoflotanteComponent implements OnInit {
  userNameValidado = false;
  updateid = -1;
  idPersonaDatos = 0;
  editable = false;
  tituloAccion = "";
  titleButton = "Guardar";
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
  asentamientoOtro: string = "";
  numExterior: string = "";
  numInterior: string = "";
  pass:string = "";
  pass2:string = "";
  nombrePersona: string = "";
  apPaterno: string = "";
  apMaterno: string = "";
  telefono: string = "";
  email:string="";
  curp:string="";

  empresa: string= "";
  proyectoIngreso: string = "";
  estatus = 1;
  edad = 0;
  genero = "";
  clabeInter: string = "";
  banco : string ="";
  numeroCuenta : string = "";
  numeroTarjeta : string = "";
  comentarios: string = "";






  arrayAsentamientos:Array<{nombre: string, tipo: string, cadena: string}>=[];


  constructor(
    private route: ActivatedRoute
              ,private router: Router,
              private _snackBar: MatSnackBar,
              private httpSepomex: ApisepomexService
              ,private httpTickets: ServiciosTicketsService
  ) { 

    this.updateid = Number(this.route.snapshot.paramMap.get("idFlotante"));
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

  }

  ngOnInit(): void {
  }



  buscarCurp(){
    var json = {
      "curp" : this.curp
    };
     this.httpTickets.buscaCurp(json).subscribe(
        datos => {
           var json = JSON.parse(JSON.stringify(datos));
           console.log(json+" esto en json "+JSON.stringify(json)); 
          if(json.length != 0){
            this.openSnackBar("este CURP ya esta registrado");
            this.userNameValidado = false;
          }else{
            this.userNameValidado = true;
          }
        });
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

 openSnackBar(mensaje: string) {
  this._snackBar.open(mensaje, '', {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    duration:  1500,
  });
}


saveData(){

  if(this.validarDatos()){

    var json = {
      "idIngenieroFlotante": this.updateid,
      "curp" : this.curp,
      "pass": this.pass,
      "nombre" : this.nombrePersona,
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
      "cp" : this.codePostal,
      "empresa" : this.empresa,
      "proyectoIngreso" : this.proyectoIngreso,
      "estatus" : this.estatus,
      "edad" : this.edad,
      "genero" : this.genero,
      "clabeInterbancaria": this.clabeInter,
      "banco" : this.banco,
      "numeroCuenta" : this.numeroCuenta,
      "numeroTarjeta" : this.numeroTarjeta,
      "comentarios" : this.comentarios

    };
  

    if(this.updateid > 0){
      this.httpTickets.updateFlotante(json).subscribe(
        datos => {
           var json = JSON.parse(JSON.stringify(datos));
           if(json.status === "success"){
               this.openSnackBar("Listo");
           }else{
             this.openSnackBar("Error, intenta más tarde");
           }
               console.log(json+" esto en json "+JSON.stringify(json)); 
             });
  
    }else{

      this.httpTickets.setIngenieroFlotante(json).subscribe(
      datos => {
      var json = JSON.parse(JSON.stringify(datos));
      if(json.status === "success"){
        this.openSnackBar("Registro exitoso");
                this.router.navigate(['/flotantes']);
            
      
          }else{
            this.openSnackBar("Error, intenta más tarde");
          }
              console.log(json+" esto en json "+JSON.stringify(json)); 
            });
    }
  }
 
}

btnSalir(){
  this.router.navigate(['/flotantes']);
}



getDataPersona(){
  console.log(this.asentamiento);
  var json ={
    "idIng" : this.updateid
  }

  this.httpTickets.getFlotante(json).subscribe(
       datos => {
          var json = JSON.parse(JSON.stringify(datos));
          
              console.log(json+" esto en json "+JSON.stringify(json));
              //this.userName = json[0].userName;
          
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


            this.empresa = json[0].empresa;
            this.proyectoIngreso = json[0].proyectoIngreso;
            this.estatus =  json[0].estatus;
            this.edad = json[0].edad;
            this.genero = json[0].genero;
            this.clabeInter = json[0].clabeInterbancaria;
            this.banco = json[0].banco;
            this.numeroCuenta = json[0].numeroCuenta;
            this.numeroTarjeta = json[0].numeroTarjeta;
            this.comentarios = json[0].comentarios;

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

validarDatos(){
   
  if(this.updateid < 0){
    if(!this.userNameValidado || this.curp.length != 18){
      this.openSnackBar("Ingresa un CURP valido");
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
  }else if(this.email ===  ""){
    this.openSnackBar("Ingresa un email valido");
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
  }else if(this.numExterior === ""){
    this.openSnackBar("Ingresa calle");
    return false;
  }
  else if(this.numExterior === ""){
    this.openSnackBar("Ingresa número exterior");
    return false;
  }
  
else if(this.empresa === ""){
  this.openSnackBar("Selecciona una empresa");
  return false;
}else if(this.proyectoIngreso === ""){
  this.openSnackBar("Ingresa un proyecto de ingreso");
  return false;
}else if(this.edad < 18){
  this.openSnackBar("Ingresa edad");
  return false;
}
else if(this.genero === ""){
  this.openSnackBar("Selecciona el genero");
  return false;
}else if(this.clabeInter === ""){
  this.openSnackBar("Ingresa la clabe interbancaria");
  return false;
}else if(this.banco === "" ){
  this.openSnackBar("Ingresa el banco");
  return false;
}else if(this.numeroCuenta === ""){
  this.openSnackBar("Ingresa número de cuenta");
  return false;
}
else if(this.numeroTarjeta === ""){
  this.openSnackBar("Ingresa número de tarjeta");
  return false;
} else{
    return true;
  }

}

}
