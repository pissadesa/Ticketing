import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';

import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ApisepomexService } from '../servicios/apisepomex.service';

import { DialogoFolioComponent } from '../dialogo-folio/dialogo-folio.component';



@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.css']
})
export class TicketComponent implements OnInit {

  folio = "";

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  sesion : any;
  
  
  arrayAgentes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string, tipo: number, nombreTipo: string}>=[];
  arrayFlotantes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string, tipo: number, nombreTipo: string}>=[];
  arrayShow:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string, tipo: number, nombreTipo: string}>=[];

  tiempoUrgente =0;
  arrayTipos:Array<{id: number,nombre: string}>=[];
  arrayProyectos:Array<{idProyecto: number,idUsuario: number,nombre: string,nombreProyecto: string}>=[];
  
  tipoAsignado =0;
  tipoSelected= 0;
  proyectoSelected= 0;
  asunto = "";
  estatusSelected = 1;
  prioridadSelected = 0;
  descripcion = "";
  nombresolicitante = "";
  correoContacto = "";
  arrayAsentamientos:Array<{nombre: string, tipo: string, cadena: string}>=[];
  codePostal:string ="";
  pais: string = "México";
  municipio:string ="";
  estado:string ="";
  calle: string = "";
  asentamiento: string = "Selecciona...";
  asentamientoOtro: string = "";
  numExterior: string = "";
  numInterior: string = "";
  idAgenteSelected = 0;
  
  
  // arrayNombreAuto:Array<string>=[];
  // arrayCPAuto:Array<string>=[];
  // arrayEstadoAuto:Array<string>=[];
  // arrayMunicipioAuto:Array<string>=[];
  // arrayAsentamientoAuto:Array<string>=[];
  // arrayCalleAuto:Array<string>=[];
  // arrayNumeroInteriorAuto :Array<string>=[];
  // arrayNumeroExteriorAuto :Array<string>=[];
  
  arraySugerencias: Array<{nombreSolicitante: string,
                           cp : string, 
                           Estado: string, 
                           municipio: string,
                           asentamiento: string,
                           calle: string,
                           numeroExterior: string,
                           numeroInterior: string }> = []
  
  
  

  constructor(config: NgbModalConfig, private modalService: NgbModal, public dialog: MatDialog,  private httpSepomex: ApisepomexService, private router: Router,   private _snackBar: MatSnackBar,private cookieService: CookieService,private httpTickets: ServiciosTicketsService) {

    if(this.cookieService.get('ticketingUser') != ""){
      this.sesion = JSON.parse(this.cookieService.get('ticketingUser'));
      console.log(this.sesion+" "+JSON.stringify(this.sesion));
    }
    config.backdrop = 'static';
    config.keyboard = false;
    
   }

  ngOnInit(): void {
    this.getTiposticket();
    this.getProyectos();
    
    this.getPersonas();
    this.getFlotantes();

  }

  getTiposticket(){
    this.httpTickets.getTiposTickets().subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = 0 ; i < json.length; i++){
                this.arrayTipos.push({ id: json[i].idtipoticket, 
                                          nombre: json[i].nombre
                                        });
             }
         
  });
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
  
nuevoTIcket(){
  if(this.validarDatos()){
      this.generateFolio(this.proyectoSelected);
      this.geocodeAddress();
    }
}

openSnackBar(mensaje: string) {
  this._snackBar.open(mensaje, '', {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    duration:  1500,
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
              console.log(json+" esto en json for: "+JSON.stringify(jsonAsentamiento));
              this.estado = jsonAsentamiento.Estado;
              this.municipio = jsonAsentamiento.Municipio;
           
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



confirmarCreacionMail(){
  var json = {
    "correo": this.correoContacto,
    "asunto": "prueba de email",
    "mensaje" : "<strong>Hola "+this.nombresolicitante+" tu ticket se ha creado</strong>"
}
    this.httpTickets.sendAlerte(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
         if(json.status === "success"){
             this.openSnackBar("Se notifico al solicitante");


         }else{
           this.openSnackBar("Error al notificar al cliente");
         }
             console.log(json+" esto en json "+JSON.stringify(json)); 
           });
}

validarDatos(){
   if(this.proyectoSelected === 0){
    this.openSnackBar("Selecciona un proyecto");
    return false;
  }else if(this.nombresolicitante === ""){
    this.openSnackBar("Ingresa el solicitante");
    return false;
  }else if(this.correoContacto === ""){
    this.openSnackBar("Ingresa un correo de contacto");
    return false;
  }else if(this.tipoSelected == 0){
    this.openSnackBar("selecciona un tipo de ticket");
    return false;
  }else if(this.prioridadSelected == 0){
    this.openSnackBar("selecciona prioridad");
    return false;
  }else if(this.asunto === ""){
    this.openSnackBar("Ingresa el asunto");
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


generateFolio(idProyecto: number){
    var nombreProyecto = "";
    for(var i = 0 ; i < this.arrayProyectos.length ; i++){
        if(this.arrayProyectos[i].idProyecto == idProyecto){
            nombreProyecto = this.arrayProyectos[i].nombreProyecto
        }
    }
    var prefijo = "";
    if(nombreProyecto.length > 3){
      prefijo = nombreProyecto.substring(0,3);
    }else{
      prefijo = nombreProyecto;
    }

    var date = new Date();
    var dia = date.getDate().toString();
    var mes = (date.getMonth()+1).toString();
    if(dia.length < 2){
      dia = "0"+dia;
    }

    if(mes.length < 2){
      mes = "0"+mes;
    }

    var year = date.getFullYear().toString().substring(2);

    this.folio = prefijo.toUpperCase()+dia+mes+year;
    
    console.log("si genero el folio "+this.folio);
}


abrirDialogo() {
  const dialogo1 = this.dialog.open(DialogoFolioComponent, {
    data: this.folio
  });

  dialogo1.afterClosed().subscribe(art => {
    this.router.navigate(['/tickets',0]);

  });
}

geocodeAddress() {

  console.log("entro en direccion");
  var dire = this.pais+", "+this.estado+", "+this.municipio+", "+this.asentamiento+", "+this.calle+", "+this.numExterior;
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: dire }, (results, status) => {
    if (status === "OK") {
      
      var json = results![0].geometry.location;
      console.log(JSON.stringify(json)+" - "+json.lat()+" "+json.lat());
      
      
      var json2 = {
        "asunto" : this.asunto,
        "prioridad" : this.prioridadSelected,
        "descripcion" :  this.descripcion,
        "idTipoTicket" : this.tipoSelected,
        "idEstatus": this.estatusSelected,
        "idCreador" : this.sesion.idusuario,
        "idProyecto" : this.proyectoSelected,
        "nombreSolicitante" : this.nombresolicitante,
        "correoContacto" : this.correoContacto,
        "cp" : this.codePostal,
        "estado" : this.estado,
        "pais" : this.pais,
        "municipio" : this.municipio,
        "asentamiento" : this.asentamiento,
        "calle" : this.calle,
        "numExt" : this.numExterior,
        "numInt" : this.numInterior,
        "folio" :this.folio,
        /*"lat" : 19.291541,
        "lng" : -99.666844,*/
        "lat" : json.lat(),
        "lng" : json.lng(),
        "idAgente" : this.idAgenteSelected,
        "tipoAgente" : this.tipoAsignado,
        "tiempoUrgente" : this.tiempoUrgente
        }
    
      this.httpTickets.nuevoTicket(json2).subscribe(
        datos => {
           var json3 = JSON.parse(JSON.stringify(datos));
           if(json3.status === "success"){
           //  this.confirmarCreacionMail();
               this.openSnackBar("Listo");
              this.folio = json3.folio; 
               this.abrirDialogo();
               
           }else{
             this.openSnackBar("Error, intenta más tarde");
           }
               console.log(json3+" esto en json "+JSON.stringify(json3)); 
             });
      
      
      
      
      
      
      
      
      
      
      
      
      
      
  

    } else {
      alert("La dirección no fue encontrada");
    }
  });
  
  
  }


  cambioSwitch(){
    this.idAgenteSelected = 0;
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

  
  
  guardarTiempoUrgente(){
    if(this.tiempoUrgente > 0){
      this.modalService.dismissAll();
    }else{
      this.openSnackBar("Ingresa las horas de solución");
    }
  }
  
  
  
  busquedaContacto(content: any){
    
    var json ={
      "correo" : this.correoContacto
    }
    console.log("mando a bsucar "+json );
    this.httpTickets.getInfoContacto(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
         console.log(json+" esto en json "+JSON.stringify(json));
             
         
         this.arraySugerencias = [];
         if(json.length != 0){
           
          for(var i = 0 ; i < json.length; i++ ){
            if(!this.validarContacto(json[i])){
              this.arraySugerencias.push({
                nombreSolicitante: json[i].nombreSolicitante,
                cp : json[i].cp, 
                Estado: json[i].Estado, 
                municipio: json[i].municipio,
                asentamiento: json[i].asentamiento,
                calle: json[i].calle,
                numeroExterior: json[i].numeroExterior,
                numeroInterior: json[i].numeroInterior
              });  
            }
            
            
          }
          
          this.modalService.open(content, { size: 'xl' });
         }
         
         
             
         
  });
  }
  
  
  validarContacto(json: any){
    for(var i = 0 ; i < this.arraySugerencias.length;i++){
      if(this.arraySugerencias[i].nombreSolicitante === json.nombreSolicitante 
      && this.arraySugerencias[i].cp === json.cp
      && this.arraySugerencias[i].Estado === json.Estado
      && this.arraySugerencias[i].municipio === json.municipio
      && this.arraySugerencias[i].asentamiento === json.asentamiento
      && this.arraySugerencias[i].calle === json.calle
      && this.arraySugerencias[i].numeroExterior === json.numeroExterior
      && this.arraySugerencias[i].numeroInterior === json.numeroInterior){
        return true;
      }
    }
    return false;
    
    
    
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
  
  countries = [ 
    {
      "id" : 144,
      "name" : "Afganistán"
    },
    {
      "id" : 114,
      "name" : "Albania"
    },
    {
      "id" : 18,
      "name" : "Alemania"
    },
    {
      "id" : 98,
      "name" : "Algeria"
    },
    {
      "id" : 145,
      "name" : "Andorra"
    },
    {
      "id" : 119,
      "name" : "Angola"
    },
    {
      "id" : 4,
      "name" : "Anguilla"
    },
    {
      "id" : 147,
      "name" : "Antigua y Barbuda"
    },
    {
      "id" : 207,
      "name" : "Antillas Holandesas"
    },
    {
      "id" : 91,
      "name" : "Arabia Saudita"
    },
    {
      "id" : 5,
      "name" : "Argentina"
    },
    {
      "id" : 6,
      "name" : "Armenia"
    },
    {
      "id" : 142,
      "name" : "Aruba"
    },
    {
      "id" : 1,
      "name" : "Australia"
    },
    {
      "id" : 2,
      "name" : "Austria"
    },
    {
      "id" : 3,
      "name" : "Azerbaiyán"
    },
    {
      "id" : 80,
      "name" : "Bahamas"
    },
    {
      "id" : 127,
      "name" : "Bahrein"
    },
    {
      "id" : 149,
      "name" : "Bangladesh"
    },
    {
      "id" : 128,
      "name" : "Barbados"
    },
    {
      "id" : 9,
      "name" : "Bélgica"
    },
    {
      "id" : 8,
      "name" : "Belice"
    },
    {
      "id" : 151,
      "name" : "Benín"
    },
    {
      "id" : 10,
      "name" : "Bermudas"
    },
    {
      "id" : 7,
      "name" : "Bielorrusia"
    },
    {
      "id" : 123,
      "name" : "Bolivia"
    },
    {
      "id" : 79,
      "name" : "Bosnia y Herzegovina"
    },
    {
      "id" : 100,
      "name" : "Botsuana"
    },
    {
      "id" : 12,
      "name" : "Brasil"
    },
    {
      "id" : 155,
      "name" : "Brunéi"
    },
    {
      "id" : 11,
      "name" : "Bulgaria"
    },
    {
      "id" : 156,
      "name" : "Burkina Faso"
    },
    {
      "id" : 157,
      "name" : "Burundi"
    },
    {
      "id" : 152,
      "name" : "Bután"
    },
    {
      "id" : 159,
      "name" : "Cabo Verde"
    },
    {
      "id" : 158,
      "name" : "Camboya"
    },
    {
      "id" : 31,
      "name" : "Camerún"
    },
    {
      "id" : 32,
      "name" : "Canadá"
    },
    {
      "id" : 130,
      "name" : "Chad"
    },
    {
      "id" : 81,
      "name" : "Chile"
    },
    {
      "id" : 35,
      "name" : "China"
    },
    {
      "id" : 33,
      "name" : "Chipre"
    },
    {
      "id" : 82,
      "name" : "Colombia"
    },
    {
      "id" : 164,
      "name" : "Comores"
    },
    {
      "id" : 112,
      "name" : "Congo (Brazzaville)"
    },
    {
      "id" : 165,
      "name" : "Congo (Kinshasa)"
    },
    {
      "id" : 166,
      "name" : "Cook, Islas"
    },
    {
      "id" : 84,
      "name" : "Corea del Norte"
    },
    {
      "id" : 69,
      "name" : "Corea del Sur"
    },
    {
      "id" : 168,
      "name" : "Costa de Marfil"
    },
    {
      "id" : 36,
      "name" : "Costa Rica"
    },
    {
      "id" : 71,
      "name" : "Croacia"
    },
    {
      "id" : 113,
      "name" : "Cuba"
    },
    {
      "id" : 22,
      "name" : "Dinamarca"
    },
    {
      "id" : 169,
      "name" : "Djibouti, Yibuti"
    },
    {
      "id" : 103,
      "name" : "Ecuador"
    },
    {
      "id" : 23,
      "name" : "Egipto"
    },
    {
      "id" : 51,
      "name" : "El Salvador"
    },
    {
      "id" : 93,
      "name" : "Emiratos Árabes Unidos"
    },
    {
      "id" : 173,
      "name" : "Eritrea"
    },
    {
      "id" : 52,
      "name" : "Eslovaquia"
    },
    {
      "id" : 53,
      "name" : "Eslovenia"
    },
    {
      "id" : 28,
      "name" : "España"
    },
    {
      "id" : 55,
      "name" : "Estados Unidos"
    },
    {
      "id" : 68,
      "name" : "Estonia"
    },
    {
      "id" : 121,
      "name" : "Etiopía"
    },
    {
      "id" : 175,
      "name" : "Feroe, Islas"
    },
    {
      "id" : 90,
      "name" : "Filipinas"
    },
    {
      "id" : 63,
      "name" : "Finlandia"
    },
    {
      "id" : 176,
      "name" : "Fiyi"
    },
    {
      "id" : 64,
      "name" : "Francia"
    },
    {
      "id" : 180,
      "name" : "Gabón"
    },
    {
      "id" : 181,
      "name" : "Gambia"
    },
    {
      "id" : 21,
      "name" : "Georgia"
    },
    {
      "id" : 105,
      "name" : "Ghana"
    },
    {
      "id" : 143,
      "name" : "Gibraltar"
    },
    {
      "id" : 184,
      "name" : "Granada"
    },
    {
      "id" : 20,
      "name" : "Grecia"
    },
    {
      "id" : 94,
      "name" : "Groenlandia"
    },
    {
      "id" : 17,
      "name" : "Guadalupe"
    },
    {
      "id" : 185,
      "name" : "Guatemala"
    },
    {
      "id" : 186,
      "name" : "Guernsey"
    },
    {
      "id" : 187,
      "name" : "Guinea"
    },
    {
      "id" : 172,
      "name" : "Guinea Ecuatorial"
    },
    {
      "id" : 188,
      "name" : "Guinea-Bissau"
    },
    {
      "id" : 189,
      "name" : "Guyana"
    },
    {
      "id" : 16,
      "name" : "Haiti"
    },
    {
      "id" : 137,
      "name" : "Honduras"
    },
    {
      "id" : 73,
      "name" : "Hong Kong"
    },
    {
      "id" : 14,
      "name" : "Hungría"
    },
    {
      "id" : 25,
      "name" : "India"
    },
    {
      "id" : 74,
      "name" : "Indonesia"
    },
    {
      "id" : 140,
      "name" : "Irak"
    },
    {
      "id" : 26,
      "name" : "Irán"
    },
    {
      "id" : 27,
      "name" : "Irlanda"
    },
    {
      "id" : 215,
      "name" : "Isla Pitcairn"
    },
    {
      "id" : 83,
      "name" : "Islandia"
    },
    {
      "id" : 228,
      "name" : "Islas Salomón"
    },
    {
      "id" : 58,
      "name" : "Islas Turcas y Caicos"
    },
    {
      "id" : 154,
      "name" : "Islas Virgenes Británicas"
    },
    {
      "id" : 24,
      "name" : "Israel"
    },
    {
      "id" : 29,
      "name" : "Italia"
    },
    {
      "id" : 132,
      "name" : "Jamaica"
    },
    {
      "id" : 70,
      "name" : "Japón"
    },
    {
      "id" : 193,
      "name" : "Jersey"
    },
    {
      "id" : 75,
      "name" : "Jordania"
    },
    {
      "id" : 30,
      "name" : "Kazajstán"
    },
    {
      "id" : 97,
      "name" : "Kenia"
    },
    {
      "id" : 34,
      "name" : "Kirguistán"
    },
    {
      "id" : 195,
      "name" : "Kiribati"
    },
    {
      "id" : 37,
      "name" : "Kuwait"
    },
    {
      "id" : 196,
      "name" : "Laos"
    },
    {
      "id" : 197,
      "name" : "Lesotho"
    },
    {
      "id" : 38,
      "name" : "Letonia"
    },
    {
      "id" : 99,
      "name" : "Líbano"
    },
    {
      "id" : 198,
      "name" : "Liberia"
    },
    {
      "id" : 39,
      "name" : "Libia"
    },
    {
      "id" : 126,
      "name" : "Liechtenstein"
    },
    {
      "id" : 40,
      "name" : "Lituania"
    },
    {
      "id" : 41,
      "name" : "Luxemburgo"
    },
    {
      "id" : 85,
      "name" : "Macedonia"
    },
    {
      "id" : 134,
      "name" : "Madagascar"
    },
    {
      "id" : 76,
      "name" : "Malasia"
    },
    {
      "id" : 125,
      "name" : "Malawi"
    },
    {
      "id" : 200,
      "name" : "Maldivas"
    },
    {
      "id" : 133,
      "name" : "Malí"
    },
    {
      "id" : 86,
      "name" : "Malta"
    },
    {
      "id" : 131,
      "name" : "Man, Isla de"
    },
    {
      "id" : 104,
      "name" : "Marruecos"
    },
    {
      "id" : 201,
      "name" : "Martinica"
    },
    {
      "id" : 202,
      "name" : "Mauricio"
    },
    {
      "id" : 108,
      "name" : "Mauritania"
    },
    {
      "id" : 42,
      "name" : "México"
    },
    {
      "id" : 43,
      "name" : "Moldavia"
    },
    {
      "id" : 44,
      "name" : "Mónaco"
    },
    {
      "id" : 139,
      "name" : "Mongolia"
    },
    {
      "id" : 117,
      "name" : "Mozambique"
    },
    {
      "id" : 205,
      "name" : "Myanmar"
    },
    {
      "id" : 102,
      "name" : "Namibia"
    },
    {
      "id" : 206,
      "name" : "Nauru"
    },
    {
      "id" : 107,
      "name" : "Nepal"
    },
    {
      "id" : 209,
      "name" : "Nicaragua"
    },
    {
      "id" : 210,
      "name" : "Níger"
    },
    {
      "id" : 115,
      "name" : "Nigeria"
    },
    {
      "id" : 212,
      "name" : "Norfolk Island"
    },
    {
      "id" : 46,
      "name" : "Noruega"
    },
    {
      "id" : 208,
      "name" : "Nueva Caledonia"
    },
    {
      "id" : 45,
      "name" : "Nueva Zelanda"
    },
    {
      "id" : 213,
      "name" : "Omán"
    },
    {
      "id" : 19,
      "name" : "Países Bajos, Holanda"
    },
    {
      "id" : 87,
      "name" : "Pakistán"
    },
    {
      "id" : 124,
      "name" : "Panamá"
    },
    {
      "id" : 88,
      "name" : "Papúa-Nueva Guinea"
    },
    {
      "id" : 110,
      "name" : "Paraguay"
    },
    {
      "id" : 89,
      "name" : "Perú"
    },
    {
      "id" : 178,
      "name" : "Polinesia Francesa"
    },
    {
      "id" : 47,
      "name" : "Polonia"
    },
    {
      "id" : 48,
      "name" : "Portugal"
    },
    {
      "id" : 246,
      "name" : "Puerto Rico"
    },
    {
      "id" : 216,
      "name" : "Qatar"
    },
    {
      "id" : 13,
      "name" : "Reino Unido"
    },
    {
      "id" : 65,
      "name" : "República Checa"
    },
    {
      "id" : 138,
      "name" : "República Dominicana"
    },
    {
      "id" : 49,
      "name" : "Reunión"
    },
    {
      "id" : 217,
      "name" : "Ruanda"
    },
    {
      "id" : 72,
      "name" : "Rumanía"
    },
    {
      "id" : 50,
      "name" : "Rusia"
    },
    {
      "id" : 242,
      "name" : "Sáhara Occidental"
    },
    {
      "id" : 223,
      "name" : "Samoa"
    },
    {
      "id" : 219,
      "name" : "San Cristobal y Nevis"
    },
    {
      "id" : 224,
      "name" : "San Marino"
    },
    {
      "id" : 221,
      "name" : "San Pedro y Miquelón"
    },
    {
      "id" : 225,
      "name" : "San Tomé y Príncipe"
    },
    {
      "id" : 222,
      "name" : "San Vincente y Granadinas"
    },
    {
      "id" : 218,
      "name" : "Santa Elena"
    },
    {
      "id" : 220,
      "name" : "Santa Lucía"
    },
    {
      "id" : 135,
      "name" : "Senegal"
    },
    {
      "id" : 226,
      "name" : "Serbia y Montenegro"
    },
    {
      "id" : 109,
      "name" : "Seychelles"
    },
    {
      "id" : 227,
      "name" : "Sierra Leona"
    },
    {
      "id" : 77,
      "name" : "Singapur"
    },
    {
      "id" : 106,
      "name" : "Siria"
    },
    {
      "id" : 229,
      "name" : "Somalia"
    },
    {
      "id" : 120,
      "name" : "Sri Lanka"
    },
    {
      "id" : 141,
      "name" : "Sudáfrica"
    },
    {
      "id" : 232,
      "name" : "Sudán"
    },
    {
      "id" : 67,
      "name" : "Suecia"
    },
    {
      "id" : 66,
      "name" : "Suiza"
    },
    {
      "id" : 54,
      "name" : "Surinam"
    },
    {
      "id" : 234,
      "name" : "Swazilandia"
    },
    {
      "id" : 56,
      "name" : "Tadjikistan"
    },
    {
      "id" : 92,
      "name" : "Tailandia"
    },
    {
      "id" : 78,
      "name" : "Taiwan"
    },
    {
      "id" : 101,
      "name" : "Tanzania"
    },
    {
      "id" : 171,
      "name" : "Timor Oriental"
    },
    {
      "id" : 136,
      "name" : "Togo"
    },
    {
      "id" : 235,
      "name" : "Tokelau"
    },
    {
      "id" : 236,
      "name" : "Tonga"
    },
    {
      "id" : 237,
      "name" : "Trinidad y Tobago"
    },
    {
      "id" : 122,
      "name" : "Túnez"
    },
    {
      "id" : 57,
      "name" : "Turkmenistan"
    },
    {
      "id" : 59,
      "name" : "Turquía"
    },
    {
      "id" : 239,
      "name" : "Tuvalu"
    },
    {
      "id" : 62,
      "name" : "Ucrania"
    },
    {
      "id" : 60,
      "name" : "Uganda"
    },
    {
      "id" : 111,
      "name" : "Uruguay"
    },
    {
      "id" : 61,
      "name" : "Uzbekistán"
    },
    {
      "id" : 240,
      "name" : "Vanuatu"
    },
    {
      "id" : 95,
      "name" : "Venezuela"
    },
    {
      "id" : 15,
      "name" : "Vietnam"
    },
    {
      "id" : 241,
      "name" : "Wallis y Futuna"
    },
    {
      "id" : 243,
      "name" : "Yemen"
    },
    {
      "id" : 116,
      "name" : "Zambia"
    },
    {
      "id" : 96,
      "name" : "Zimbabwe"
    }
  ];
  
  
  
  btnAsignar(sugerencia : any){
    this.nombresolicitante = sugerencia.nombreSolicitante;
    this.codePostal = sugerencia.cp;
    this.estado = sugerencia.Estado;
    
    this.getInfoCp();
    
    this.asentamiento = sugerencia.asentamiento;
    this.municipio = sugerencia.municipio;
    this.calle = sugerencia.calle;
    
    this.numExterior = sugerencia.numeroExterior;
    this.modalService.dismissAll();
  }

  cambioPrioridad(content3: any){
    if(this.prioridadSelected == 4){
      this.modalService.open(content3);
    }else{
      this.tiempoUrgente = 0;
    }
  }

  cancelarEstatusUrgente(){
    //this.getInfoTicket();
    this.prioridadSelected = 0;
    this.modalService.dismissAll();
  }
  
}

