import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportXlsService } from '../export-xls.service';

import { ServiciosTicketsService } from '../servicios/servicios-tickets.service';





@Component({
  selector: 'app-tickets-flotante',
  templateUrl: './tickets-flotante.component.html',
  styleUrls: ['./tickets-flotante.component.css']
})
export class TicketsFlotanteComponent implements OnInit {

  arrayTickets:Array<{idTicket: number,
    asunto: string,
    proyecto: string, 
    prioridad: string, 
    estado: string}>=[];
    json:any;

idFlotante = 0;
nombreAgente = "";

  constructor(private route: ActivatedRoute,
              private router: Router,
              private httpTickets: ServiciosTicketsService,
              private xlsServicio: ExportXlsService) {
               
              this.idFlotante = Number(this.route.snapshot.paramMap.get("idFlotante"));
              this.getTicketsFlotante();
              this.getDataFlotante();
  }

  ngOnInit(): void {
  }




  getDataFlotante(){
    var json ={
      "idIng" : this.idFlotante
    }
  
    this.httpTickets.getFlotante(json).subscribe(
         datos => {
            var json = JSON.parse(JSON.stringify(datos));
            
                console.log(json+" esto en json "+JSON.stringify(json));
                //this.userName = json[0].userName;
  
                this.nombreAgente = json[0].nombre+" "+json[0].apPaterno+" "+json[0].apMaterno; 
  
              });
  }


  
  getTicketsFlotante(){

    console.log("bucar tckets con el id flotante de : "+this.idFlotante);
    var json = {
        "idFlotante" : this.idFlotante
    };
    this.httpTickets.getTicketsFlotante(json).subscribe(
      datos => {
        
        this.arrayTickets = [];
         var json = JSON.parse(JSON.stringify(datos));
             console.log(json+" esto en json "+JSON.stringify(json));
             this.json = json;
              for(var i = 0 ; i < json.length; i++){
                  /*this.arrayTickets.push({
                    idTicket: json[i].idticket,
                    asunto: json[i].asunto,
                    proyecto: json[i].nombreProyecto, 
                    prioridad: json[i].prioridad, 
                    estado: json[i].idEstatus}
                  );*/

                  this.insertShowArray(json[i]);


              }
                  
                  
  
           
      });
  }

  btnDetalle(ticket: any){
    console.log("ticket: "+ticket.idTicket);
    this.router.navigate(['/seguimiento', ticket.idTicket, "3"]);
  }
  

  insertShowArray(json: any){
    /*
    idTicket: number,
                            asunto: string,
                            proyecto: string, 
                            prioridad: number, 
                            estado: number}
    */
    let id = json.idticket;
    let asunto = json.asunto;
    let proyecto = json.nombreProyecto;
  
    let prioridad = "";
    switch(json.prioridad){
      case 1:
        prioridad = "Baja";
        break;
      case 2:
        prioridad = "Media";
        break;
      case 3:
        prioridad = "Alta";
        break;
      case 4:
        prioridad = "Incidente mayor";
        break;
  
    }
    let estado = "";
    switch(json.idEstatus){
      case 1:
        estado = "Abierto";
        break;
      case 2:
        estado = "Pendiente";
        break;
      case 3:
        estado = "Resuelto";
        break;
      case 4:
        estado = "Cerrado";
        break;
      case 5:
        estado = "Reabierto";
          break;
    
    }
  
  
    this.arrayTickets.push({idTicket: id,
      asunto: asunto,
      proyecto: proyecto, 
      prioridad: prioridad, 
      estado: estado});
  }


  exportAsXLSX(): void {
    this.xlsServicio.exportAsExcelFile(this.json, 'export-to-excel');
  }

}
