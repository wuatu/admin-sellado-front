import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeguimientoDeCajas } from '../models/seguimiento-de-cajas';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProduccionColaboradorService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getProduccionSearch(rutSearch:string, fromDateSearch: string, toDateSearch: string){
    return this.httpClient.get(`${this.API_URL}/produccion_colaborador/${rutSearch}/${fromDateSearch}/${toDateSearch}`);
  }
  
  

  
}
