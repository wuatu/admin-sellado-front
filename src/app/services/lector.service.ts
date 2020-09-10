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

  getLectores(id:string){
    return this.httpClient.get(`${this.API_URL}/lectores/${id}`);
  }
  getLectoresId(idSelladora:number, idLinea:number){
    return this.httpClient.get(`${this.API_URL}/lectores/${idSelladora}/${idLinea}`);
  }

  getLector(id:string){
    return this.httpClient.get(`${this.API_URL}/lector/${id}`);
  }

  deleteLector(id:string){
    return this.httpClient.delete(`${this.API_URL}/lector/${id}`);
  }

  saveLector(lector:Lector){
    console.log(lector);
    return this.httpClient.post(`${this.API_URL}/lector/`,lector);
  }

  updateLector(id:string, lector:Lector):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/lector/${id}`,lector);
  }
}
