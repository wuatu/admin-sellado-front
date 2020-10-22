import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Lector} from '../models/lector';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class LectorService {

  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getLectores(id:number){
    return this.httpClient.get(`${this.API_URL}/lectores/${id}`);
  }
  getLectoresId(id_calibrador:number, id_linea:number){
    return this.httpClient.get(`${this.API_URL}/lectores/${id_calibrador}/${id_linea}`);
  }

  getLector(id:number){
    return this.httpClient.get(`${this.API_URL}/lector/${id}`);
  }

  deleteLector(id:number){
    return this.httpClient.delete(`${this.API_URL}/lector/${id}`);
  }

  saveLector(lector:Lector){
    console.log(lector);
    return this.httpClient.post(`${this.API_URL}/lector/`,lector);
  }

  updateLector(id:number, lector:Lector):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/lector/${id}`,lector);
  }
}
