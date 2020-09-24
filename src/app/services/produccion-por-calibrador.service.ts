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
  
  getLineOfCaliper(id_calibrador: number, fecha_desde: string, fecha_hasta: string ){
    return this.httpClient.get(`${this.API_URL}/registros_lineas_calibrador/${id_calibrador}/${fecha_desde}/${fecha_hasta}`);
  }
  
  getBoxInLineByDate(id_linea: number, id_calibrador: number, fecha_desde: string, fecha_hasta: string){
    return this.httpClient.get(`${this.API_URL}/registros_cajas_lineas/${id_calibrador}/${id_linea}/${fecha_desde}/${fecha_hasta}`);
  }

  
}
