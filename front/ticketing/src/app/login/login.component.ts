import { Component, OnInit } from '@angular/core';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName = "";
  pass = "";


  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  sesion : any;

  constructor( private router: Router, private cookieService: CookieService, private _snackBar: MatSnackBar
    ,private httpTickets: ServiciosTicketsService) {

      console.log(this.cookieService.get('ticketingUser')+"defvsdlfvn");
      if(this.cookieService.get('ticketingUser') != ""){
        this.sesion = JSON.parse(this.cookieService.get('ticketingUser'));
        console.log(this.sesion+" "+JSON.stringify(this.sesion));
        if(this.sesion.status == "success"){
          this.router.navigate(['/home']);
        }else{

         this.router.navigate(['']);
        }
    
      }else{
        this.router.navigate(['']);
      }










     }

  ngOnInit(): void {
  }


  login(){
    console.log("jeej");
    var json ={
      "userName" : this.userName,
      "pass" : this.pass
    }
    this.httpTickets.login(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
         if(json.status === "success"){
          this.cookieService.set( 'ticketingUser',JSON.stringify(json) );
          console.log("bienvenido");
          this.router.navigate(['/home']);
         }else{
            this.openSnackBar("Ocurrio un error, revisa tus credenciales");
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
userLogued(tipo : number){
  switch(tipo){
    case 1: 
      break;
    case 2: 
      break;
    case 3: 
      break;
    case 4: 
      break;
  }
}









}
