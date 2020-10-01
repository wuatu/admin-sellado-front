import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeguimientoDeCajas } from '../models/seguimiento-de-cajas';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ProduccionPorLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getCountBoxOfLine(id_calibrador: number, id_linea: number, fecha_desde: string, fecha_hasta: string ){
    return this.httpClient.get(`${this.API_URL}/contador_cajas_calibrador_linea/${id_calibrador}/${id_linea}/${fecha_desde}/${fecha_hasta}`);
  } 
  
  getProduccionSearch(id_caliper:number,id_line: number ,fromDateSearch: string, toDateSearch: string){
    return this.httpClient.get(`${this.API_URL}/registros_cajas_calibrador_linea/${id_caliper}/${id_line}/${fromDateSearch}/${toDateSearch}`);
  }

  updateRegistroProduccionLinea(id ,registroProduccionColaborador:SeguimientoDeCajas):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/registro_produccion_linea_update/${id}`, registroProduccionColaborador);
  }
  

}
