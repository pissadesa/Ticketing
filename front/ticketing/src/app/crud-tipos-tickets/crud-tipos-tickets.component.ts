import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';




@Component({
  selector: 'app-crud-tipos-tickets',
  templateUrl: './crud-tipos-tickets.component.html',
  styleUrls: ['./crud-tipos-tickets.component.css']
})
export class CrudTiposTicketsComponent implements OnInit {

  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  arrayTipos:Array<{id: number,nombre: string}>=[];
  nombreTipo: String = "";
  constructor(private _snackBar: MatSnackBar,private router: Router,private httpTickets: ServiciosTicketsService) { this.getTiposticket();}

  ngOnInit(): void {
 
  }


  getTiposticket(){
    this.httpTickets.getTiposTickets().subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = json.length-1 ; i >= 0; i--){
                this.arrayTipos.push({ id: json[i].idtipoticket, 
                                          nombre: json[i].nombre
                                        });
             }
  });
  }


  insertarTicket(){
    var json = {
      "nombreTipo" : this.nombreTipo
    }

    if(this.buscarRepetido()){
      this.nombreTipo = ""; 
      this.openSnackBar("Error: tipo ya existente");
    }else{

      this.httpTickets.setTipoTicket(json).subscribe(
        datos => {
           var json = JSON.parse(JSON.stringify(datos));
               console.log(json+" esto en json "+JSON.stringify(json));
               if(json.status === "success"){
                this.openSnackBar("Guardado");
                 this.arrayTipos = [];
                 this.nombreTipo = ""; 
                 this.getTiposticket();
  
                }else{
      
                }
    });
    }


  }


  btnSalir(){
    this.router.navigate(['/admin']);
  }
  


  buscarRepetido(){
    for(var i = 0 ; i < this.arrayTipos.length; i++){
        if(this.nombreTipo.toUpperCase() === this.arrayTipos[i].nombre.toUpperCase()){
            return true;
        }
    }
    return false;
  }
  

  openSnackBar(mensaje: string) {
    this._snackBar.open(mensaje, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration:  1500,
    });
  }
}