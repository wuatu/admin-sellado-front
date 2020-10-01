import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SeguimientoDeCajas } from '../models/seguimiento-de-cajas';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProduccionPorCalibradorService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getboxInCaliper(id_calibrador: number, fecha_desde: string, fecha_hasta: string ){
    console.log(id_calibrador + fecha_desde + fecha_hasta + "servicio");
    return this.httpClient.get(`${this.API_URL}/numero_cajas_calibrador/${id_calibrador}/${fecha_desde}/${fecha_hasta}`);
  }

  getProduccionSearch(id_caliper:number, fromDateSearch: string, toDateSearch: string){
    return this.httpClient.get(`${this.API_URL}/registros_cajas_calibrador/${id_caliper}/${fromDateSearch}/${toDateSearch}`);
  }
  
  updateRegistroProduccionCaliper(id:number, registroProduccionColaborador:SeguimientoDeCajas):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/registro_produccion_calibrador_update/${id}`, registroProduccionColaborador);
  }
}
