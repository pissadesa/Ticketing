import { Component, OnInit } from '@angular/core';
import { ServiciosTicketsService } from "../servicios/servicios-tickets.service";
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; // Importar


@Component({
  selector: 'app-crud-persona',
  templateUrl: './crud-persona.component.html',
  styleUrls: ['./crud-persona.component.css']
})
export class CrudPersonaComponent implements OnInit {

  tipoPersona: number = 0;
  tipoPersonaNombre: string = "";

  arrayAgentes:Array<{id: number,nombre: string, municipio: string, estado: string, telefono: string, correo: string}>=[];

  constructor(private route: ActivatedRoute,
    private httpTickets: ServiciosTicketsService,private router: Router) { 

  }

  ngOnInit(): void { 
    this.tipoPersona = Number(this.route.snapshot.paramMap.get("tipo"));

    switch(this.tipoPersona){
        case 1: this.tipoPersonaNombre = "Administradores";
        break;
        case 2: this.tipoPersonaNombre = "Lideres";
        break;
        case 3: this.tipoPersonaNombre = "Dispatch";
        break;
        case 4: this.tipoPersonaNombre = "Agentes";
        break;
    }


    this.getPersonas();
  }


  getPersonas(){
    var json ={
      "idTipo" : this.tipoPersona
    }
    this.httpTickets.getPersonas(json).subscribe(
      datos => {
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             for(var i = 0 ; i < json.length; i++){
                this.arrayAgentes.push({ id: json[i].idusuario, 
                                          nombre: json[i].nombre+" "+json[i].apPaterno+" "+json[i].apMaterno,
                                            municipio: json[i].municipio, estado: json[i].estado, telefono: json[i].telefono, correo: json[i].email
                                        });
             }
         
  });
  }

btnActualizar(id: number){
    console.log(id);
  this.router.navigate(['/persona', id, this.tipoPersona]);
}

btnNuevo(){
  this.router.navigate(['/persona', -2, this.tipoPersona]);
}


}
