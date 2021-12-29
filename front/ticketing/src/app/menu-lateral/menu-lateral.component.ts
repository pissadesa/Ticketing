import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {
  title = 'ticketing';
  visible = 1;
  visibleAdministrador = 0;
  visibleTickets = 0;
  visibleDispatch = 0;
  visibleDashboard = 0;
  visibleTalento = 0;

  sesion : any;
  constructor(private cookieService: CookieService,private router: Router) { 
 
  if(this.cookieService.get('ticketingUser') != ""){
    this.sesion = JSON.parse(this.cookieService.get('ticketingUser'));

    if(this.sesion.status == "success"){
     this.visible = 0;
     this.showMenuUser(this.sesion.idTipoUsuario);
    }else{
     this.visible = 1;
     this.router.navigate(['']);
    }

  }else{
    this.router.navigate(['']);
  }
  
}


logOut(){
  this.visible = 1;
  this.cookieService.delete("ticketingUser");
  this.router.navigate(['']);
}

  ngOnInit(): void {
  }

  showMenuUser(tipo : number){

      switch(tipo){
        case 1:
          this.visibleAdministrador = 1;
          this.visibleTickets = 1;
          this.visibleDispatch = 0;
          this.visibleDashboard = 1;
          this.visibleTalento = 0;
          break;
        case 2:
          this.visibleAdministrador = 0;
          this.visibleTickets = 1;
          this.visibleDispatch = 0;
          this.visibleDashboard = 1;
          this.visibleTalento = 1;
        break;
        case 3:
          this.visibleAdministrador = 0;
          this.visibleTickets = 0;
          this.visibleDispatch = 1;
          this.visibleDashboard = 1;
          this.visibleTalento = 1;
          break;
     
        case 4:
            this.visibleAdministrador = 0;
            this.visibleTickets = 0;
            this.visibleDispatch = 0;
            this.visibleDashboard = 1;
            this.visibleTalento = 0;
            break;
        case 5:
            this.visibleAdministrador = 0;
            this.visibleTickets = 0;
            this.visibleDispatch = 0;
            this.visibleDashboard = 1;
            this.visibleTalento = 0;
            break;
          case 6:
          this.visibleAdministrador = 0;
          this.visibleTickets = 0;
          this.visibleDispatch = 0;
          this.visibleDashboard = 0;
          this.visibleTalento = 1;
        break;
      }

  }


}
