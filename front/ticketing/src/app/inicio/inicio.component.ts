import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  sesion : any;
  nombre: string = "";

  constructor(private cookieService: CookieService) {
    if(this.cookieService.get('ticketingUser') != ""){
      this.sesion = JSON.parse(this.cookieService.get('ticketingUser'));
      console.log(this.sesion+" "+JSON.stringify(this.sesion));
      if(this.sesion.status == "success"){

        this.nombre = this.sesion.nombre+" "+this.sesion.apPaterno+" "+this.sesion.apMaterno     
        //  this.visible = 0;
     //  this.showMenuUser(this.sesion.idTipoUsuario);
      }
  
    }



   }

  ngOnInit(): void {
  }

}
