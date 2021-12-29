import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class ApisepomexService {
  token = "d32dfd16-e9e1-4472-a2d6-d21525f5893e";
  constructor(private http: HttpClient) { }


  getInfoCodePostal(cp: string){
   // return this.http.get(`https://api-sepomex.hckdrk.mx/query/info_cp/${cp}?token=${this.token}`);

   //http://189.203.240.97/vapi/api/CodigoPostal/GetLocalidadByCodigoPostal/

   return this.http.get(`https://monitor.grupopissa.com.mx/vapi/api/CodigoPostal/GetLocalidadByCodigoPostal/${cp}`);

//   return this.http.get(`http://189.203.240.97/vapi/api/CodigoPostal/GetLocalidadByCodigoPostal/${cp}`);


  }

 
}
