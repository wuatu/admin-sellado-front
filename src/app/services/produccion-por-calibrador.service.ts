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
  
  getPromedioCajasPorMinutoTurno(id_calibrador: number, id_turno:number, fecha_inicio:string, hora_inicio:string, fecha_termino:string, hora_termino:string){
    console.log("Service : getPromedioCajasPorMinutoTurno");
    return this.httpClient.get(`${this.API_URL}/get_promedio_cajas_por_minuto_turno/${id_calibrador}/${id_turno}/${fecha_inicio}/${hora_inicio}/${fecha_termino}/${hora_termino}`,{observe: 'response'});
  }

  getProduccionLineaCalibrador(id_calibrador: number, id_turno:number){
    return this.httpClient.get(`${this.API_URL}/get_produccion_linea_turno/${id_calibrador}/${id_turno}`,{observe: 'response'});
  }

  getProduccionColaborador(id_turno:number){
    return this.httpClient.get(`${this.API_URL}/get_produccion_colaborador_turno/${id_turno}`,{observe: 'response'});
  }

  getTurnos(id_calibrador: number, fecha_desde: string, fecha_hasta: string ){
    return this.httpClient.get(`${this.API_URL}/get_turnos_calibrador/${id_calibrador}/${fecha_desde}/${fecha_hasta}`,{observe: 'response'});
  }

  getboxInCaliper(id_calibrador: number, fecha_desde: string, fecha_hasta: string, id_turno: number){
    return this.httpClient.get(`${this.API_URL}/numero_cajas_calibrador/${id_calibrador}/${fecha_desde}/${fecha_hasta}/${id_turno}`);
  }

  getboxInCaliper2(id_calibrador: number, fecha_desde: string, fecha_hasta: string){
    return this.httpClient.get(`${this.API_URL}/numero_cajas_calibrador2/${id_calibrador}/${fecha_desde}/${fecha_hasta}`);
  }

  getProduccionSearch(id_caliper:number, fromDateSearch: string, toDateSearch: string, id_turno: number){
    return this.httpClient.get(`${this.API_URL}/registros_cajas_calibrador/${id_caliper}/${fromDateSearch}/${toDateSearch}/${id_turno}`,{observe: 'response'});
  }

  getProduccionSearch2(id_caliper:number, fromDateSearch: string, toDateSearch: string){
    return this.httpClient.get(`${this.API_URL}/registros_cajas_calibrador2/${id_caliper}/${fromDateSearch}/${toDateSearch}`,{observe: 'response'});
  }
  
  updateRegistroProduccionCaliper(id:number, registroProduccionColaborador:SeguimientoDeCajas):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/registro_produccion_calibrador_update/${id}`, registroProduccionColaborador);
  }
}
