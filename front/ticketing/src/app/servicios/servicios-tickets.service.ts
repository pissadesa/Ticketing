import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiciosTicketsService {
  //rutaApi = "http://localhost:3001";
  //rutaApi = "http://189.195.136.238/apiTicketing";
  
  rutaApi = "https://monitor.grupopissa.com.mx/apiTicketing";
  
  constructor(private http: HttpClient) { }

  setPersona(json: any) {
    return this.http.post(`${this.rutaApi}/registroUsuario`,json);
  }

  getPersonas(json: any) {
    return this.http.post(`${this.rutaApi}/getPersonas`, json);
  }
  getPersona(json: any) {
    return this.http.post(`${this.rutaApi}/getPersona`,json);
  }

  updateAgente(json: any) {
    return this.http.post(`${this.rutaApi}/actualizarPersona`,json);
  }

  buscarUserName(json: any) {
    return this.http.post(`${this.rutaApi}/busquedaUsuario`,json);
  }

  getTiposTickets(){
    var json = {

    };
    return this.http.post(`${this.rutaApi}/getTipoTicket`,json);
  }

  setTipoTicket(json : any){
    return this.http.post(`${this.rutaApi}/insertTipoTicket`, json);
  }

  setProyecto(json : any){
    return this.http.post(`${this.rutaApi}/insertProyecto`, json);
  }

  updateProyectoSLAs(json : any){
    return this.http.post(`${this.rutaApi}/updateProyectoSLAs`, json);
  }

  getProyectos(){
    return this.http.get(`${this.rutaApi}/getProyectos`);
  }


  login(json : any){
    return this.http.post(`${this.rutaApi}/login`, json);
  }

  nuevoTicket(json : any){
    return this.http.post(`${this.rutaApi}/nuevoTicket`, json);
  }

  
  getTickets(json : any){
    return this.http.post(`${this.rutaApi}/getTickets`, json);
  }

  getTicket(json : any){
    return this.http.post(`${this.rutaApi}/getTicket`, json);
  }
  
  
  addNota(json : any){
    return this.http.post(`${this.rutaApi}/addNota`, json);
  }

  deleteNota(json : any){
    return this.http.post(`${this.rutaApi}/deleteNota`, json);
  }

    
  updateTicket(json : any){
    return this.http.post(`${this.rutaApi}/updateTicket`, json);
  }




  uploadArchivos(fileToUpload: File, json : any){
    console.log(fileToUpload);
    const formData: FormData = new FormData();
    formData.append('photos', fileToUpload);
    const blobOverrides = new Blob([JSON.stringify(json)], {
      type: 'application/json',
    });
    formData.append('data', blobOverrides);
    return this.http.post(`${this.rutaApi}/upload`, formData);
  /* return this.http
      .post(endpoint, formData, {  })
      .map(() => { return true; })
      .catch(() => { return { "status" : "success"}});*/
}

getFile(json : any){
  return this.http.post(`${this.rutaApi}/getfile`, json, { 'responseType': 'blob'});
}

getDataFile(json : any){
  return this.http.post(`${this.rutaApi}/getDataFiles`, json);
}


deleteFile(json : any){
  return this.http.post(`${this.rutaApi}/deletefile`, json);
}

getGastos(json : any){
  return this.http.post(`${this.rutaApi}/getGastosTickets`, json);
}

setGastos(json : any){
  return this.http.post(`${this.rutaApi}/insertGastoTicket`, json);
}

getContadoresAll(json : any){
  return this.http.post(`${this.rutaApi}/getContadoresAllTickets`, json);
}


getContadoresProyecto(json : any){
  return this.http.post(`${this.rutaApi}/getContadoresTicketsProyecto`, json);
}

getContadoresLider(json : any){
  return this.http.post(`${this.rutaApi}/getContadoresTicketsLider`, json);
}

getContadoresAgente(json : any){
  return this.http.post(`${this.rutaApi}/getContadoresTicketsAgente`, json);
}

getContadoresFlotantes(json : any){
  return this.http.post(`${this.rutaApi}/getContadoresTicketsFlotantes`, json);
}


getTicketsProyecto(json : any){
  return this.http.post(`${this.rutaApi}/getTicketsProyecto`, json);
}

getTicketsLider(json : any){
  return this.http.post(`${this.rutaApi}/getTicketsLider`, json);
}

getTicketsAgente(json : any){
  return this.http.post(`${this.rutaApi}/getTicketsAgente`, json);
}



sendAlerte(json : any){
  return this.http.post(`${this.rutaApi}/sendAlerta`, json);
}


getProyecto(json : any){
  return this.http.post(`${this.rutaApi}/getProyecto`, json);
}



getPrioridadProyecto(json : any){
  return this.http.post(`${this.rutaApi}/getPrioridadesProyecto`, json);
}


setIngenieroFlotante(json : any){
  return this.http.post(`${this.rutaApi}/setIngenieroFlotante`, json);
}


getFlotantes(json : any){
  return this.http.post(`${this.rutaApi}/getIngenierosFlotantes`, json);
}

updateFlotante(json : any){
  return this.http.post(`${this.rutaApi}/updateIngenieroFlotante`, json);
}


buscaCurp(json : any){
  return this.http.post(`${this.rutaApi}/busquedaCurp`, json);
}

getFlotante(json : any){
  return this.http.post(`${this.rutaApi}/getFlotante`, json);
}

getTicketsFlotante(json : any){
  return this.http.post(`${this.rutaApi}/getTicketsFlotante`, json);
}

getReporte(){
  return this.http.post(`${this.rutaApi}/getReportes`, {});
}


getInfoContacto(json: any){
  return this.http.post(`${this.rutaApi}/getInfoContacto`, json);
}
}
