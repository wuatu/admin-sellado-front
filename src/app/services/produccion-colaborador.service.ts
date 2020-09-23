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
    return this.httpClient.get(`${this.API_URL}/registros_produccion_colaborador/${rutSearch}/${fromDateSearch}/${toDateSearch}`);
  }
  
  getProduccionSearchNumberBox(rutSearch:string, fromDateSearch: string, toDateSearch: string){
    return this.httpClient.get(`${this.API_URL}/registros_produccion_colaborador_cajas_diarias/${rutSearch}/${fromDateSearch}/${toDateSearch}`);
  }

  updateRegistroProduccionUsuario(id:number, registroProduccionColaborador:SeguimientoDeCajas):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/registro_produccion_colaborador_update/${id}`, registroProduccionColaborador);
  }
  
  

  
}
