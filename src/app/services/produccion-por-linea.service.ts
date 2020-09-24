import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProduccionPorLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getBoxOfLine(id_calibrador: number, id_linea: number, fecha_desde: string, fecha_hasta: string ){
    return this.httpClient.get(`${this.API_URL}/registros_lineas_calibrador/${id_calibrador}/${id_linea}/${fecha_desde}/${fecha_hasta}`);
  }  
}
