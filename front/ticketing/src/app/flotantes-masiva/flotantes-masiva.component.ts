import { Component, OnInit } from '@angular/core';
import {  VERSION ,ViewChild } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ServiciosTicketsService } from '../servicios/servicios-tickets.service';




@Component({
  selector: 'app-flotantes-masiva',
  templateUrl: './flotantes-masiva.component.html',
  styleUrls: ['./flotantes-masiva.component.css']
})
export class FlotantesMasivaComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 0;




  constructor(private _snackBar: MatSnackBar,private httpTickets: ServiciosTicketsService) { }

  ngOnInit(): void {
  }



  public records: any[] = [];
  public records2: any[] = [];
  contador = 0 ;
  contadorCargados = 0;
  mensaje= "";


  uploadListener($event: any): void {
    this.value = 0;

    let text = [];
    let files = $event.srcElement.files;

    if (this.isValidCSVFile(files[0])) {

      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (csvData)?.toString().split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);

        this.records = this.getDataRecordsArrayFromCSVFile(csvRecordsArray, headersRow.length);
        this.mensaje ="Documento correcto, contiene "+ this.records.length+" registros correctos.";

      };

      reader.onerror = function () {
        console.log('error is occured while reading file!');
      };




    } else {
      alert("Please import valid .csv file.");

    }
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let csvArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (csvRecordsArray[i]).split(',');
      if (curruntRecord.length == headerLength) {
          
        var json = {
        "curp" : "",
        "nombre": "",
        "apPaterno" : "",
        "apMaterno": "",
        "telefono": "",
        "email": "",
        "estado": "",
        "municipio" : "",
        "calle": "",
        "numeroExterior" : 0,
        "numeroInterior" : "",
        "colonia": "",
        "cp": 0,
        "pass":"",
        "empresa": "",
        "proyectoIngreso": "",
        "estatus": -1,
        "edad": 0,
        "genero": "",
        "clabeInterbancaria": "",
        "banco": "",
        "numeroCuenta": "",
        "numeroTarjeta": "",
        "comentarios": ""
        }

        json.estado = curruntRecord[0].trim();
        json.municipio = curruntRecord[1].trim();
        json.nombre = curruntRecord[2].trim();
        json.telefono = curruntRecord[3].trim().replaceAll(" ","");
        json.email = curruntRecord[4].trim();
        json.curp = curruntRecord[5].trim();
        json.calle = curruntRecord[6].trim();
        json.banco = curruntRecord[7].trim();
        json.numeroTarjeta = curruntRecord[8].trim();
        json.numeroCuenta = curruntRecord[9].trim();
        json.clabeInterbancaria = curruntRecord[10].trim();
        json.estatus = this.estatusNumber(curruntRecord[12].trim());
        json.comentarios = curruntRecord[13].trim();
        json.pass = json.curp;

        if(this.validarDatos(json)){

          csvArr.push(json);
        }
      }
    }
    return csvArr;
  }

//check extension
  isValidCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = (csvRecordsArr[0]).split(',');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }
  /*

  fileReset() {
    this.csvReader.nativeElement.value = "";
    this.records = [];
    this.jsondatadisplay = '';
  }

  getJsonData(){
    this.jsondatadisplay = JSON.stringify(this.records);
  }*/


  uploadAgente(json: any){
    this.httpTickets.setIngenieroFlotante(json).subscribe(
      datos => {
      var json = JSON.parse(JSON.stringify(datos));
      if(json.status === "success"){
        //this.openSnackBar("Registro exitoso");
                //this.router.navigate(['/flotantes']);

        this.contadorCargados++;
          }else{
            //this.openSnackBar("Error, intenta más tarde");
            this.records2.push(json);
          }
          this.contador++;
          this.value = (this.contador/this.records.length)*100;

            if(this.contador == this.records.length){
              this.openSnackBar("se cargaron "+this.contadorCargados+" de "+this.contador);
            }

              console.log(json+" esto en json "+JSON.stringify(json)); 
            });
  }


estatusNumber(status:string){
  if(status.toLowerCase() === "disponible"){
    return 1;
  }else if(status.toLowerCase() === "baja"){
    return -1;
  }else if(status.length == 0 || status.toLowerCase() === "pendiente"){
    return 0;
  } else{
    return -2;
  }
}


cargando(){
      for(var i = 0 ; i < this.records.length ; i++){
          this.uploadAgente(this.records[i]);

      }

}

openSnackBar(mensaje: string) {
  this._snackBar.open(mensaje, '', {
    horizontalPosition: this.horizontalPosition,
    verticalPosition: this.verticalPosition,
    duration:  3000,
  });
}


isNumeric(number: string){
  var isnumeric = Number(number);
  if( isNaN(isnumeric)){
    return false;
  }else{
    return true;
  }
}




validarDatos(json : any){
let regexpNumber = new RegExp('^[(]{0,1}[0-9]{2}[)]{0,1}[-\s\.]{0,1}[0-9]{4}[-\s\.]{0,1}[0-9]{4}$');
//let regexpEmail = new RegExp("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$");
let regexpEmail = new RegExp("^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$");

//^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$

  if(json.curp.length != 18){
    console.log("curp");
    json.calle = "CURP incorrecta"
    this.records2.push(json);
    return false;
  }else if(!regexpNumber.test(json.telefono)){
    console.log("telefono");
    json.calle = "No tiene telefono de contacto o es incorrecto"
    this.records2.push(json);
    return false;
  }else if(!regexpEmail.test(json.email)){
    console.log("correo");
    json.calle = "No tiene correo de contacto o es incorreco"
    this.records2.push(json);
    return false;
  }else if(json.estatus == -2){
    json.calle = "su estatus es desconocido"
    this.records2.push(json);
    return false;
  }else{
    return true;
  }
}

}

