import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Caja } from '../models/caja';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CajaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getCajas(){
    return this.httpClient.get(`${this.API_URL}/cajas`,{observe: 'response'});
  }

  getCaja(id:string){
    return this.httpClient.get(`${this.API_URL}/caja/${id}`,{observe: 'response'});
  }

  searchBox(criterio:string){
    console.log("searchBox : "+criterio);
    return this.httpClient.get(`${this.API_URL}/caja_search/${criterio}`,{observe: 'response'});
  }

  deleteCaja(id:string){
    return this.httpClient.delete(`${this.API_URL}/caja/${id}`);
  }

  saveCaja(caja:Caja){
    return this.httpClient.post(`${this.API_URL}/caja/`,caja);
  }

  updateCaja(id:string, caja:Caja):Observable<any>{
    console.log(caja);
    return this.httpClient.put(`${this.API_URL}/caja/${id}`,caja);
  }

}
