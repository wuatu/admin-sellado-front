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
    return this.httpClient.get(`${this.API_URL}/cajas`);
  }

  getCaja(id:string){
    return this.httpClient.get(`${this.API_URL}/caja/${id}`);
  }

  deleteCaja(id:string){
    return this.httpClient.delete(`${this.API_URL}/caja/${id}`);
  }

  saveCalibrador(caja:Caja){
    return this.httpClient.post(`${this.API_URL}/caja/`,caja);
  }

  updateCalibrador(id:string, caja:Caja):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/calibrador/${id}`,caja);
  }

}
