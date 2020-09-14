import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeguimientoDeCajas } from '../models/seguimiento-de-cajas';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SeguimientoDeCajasService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getSeguimientoDeCajas(id_linea: number, id_calibrador: number){
    return this.httpClient.get(`${this.API_URL}/cajas_selladas/${id_linea}/${id_calibrador}`);
  }
  
  getSeguimientoDeCajasSearch(envaseSearch:string, fromDateSearch: string, toDateSearch: string){
    return this.httpClient.get(`${this.API_URL}/caja_sellada/${envaseSearch}/${fromDateSearch}/${toDateSearch}`);
  }
  
  saveSeguimientoDeCajas(seguimientoDeCajas:SeguimientoDeCajas){
    return this.httpClient.post(`${this.API_URL}/caja_sellada_search/`,seguimientoDeCajas);
  }

  
}
