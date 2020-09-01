import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Linea } from '../models/linea';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getLineas(id:string){
    return this.httpClient.get(`${this.API_URL}/lineas/${id}`);
  }

  getLinea(id:string){
    return this.httpClient.get(`${this.API_URL}/linea/${id}`);
  }

  deleteLinea(id:string){
    return this.httpClient.delete(`${this.API_URL}/linea/${id}`);
  }

  saveLinea(linea:Linea){
    console.log(linea);
    return this.httpClient.post(`${this.API_URL}/linea/`,linea);
  }

  updateLinea(id:string, linea:Linea):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/linea/${id}`,linea);
  }

}
