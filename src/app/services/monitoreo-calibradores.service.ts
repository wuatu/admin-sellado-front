import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MonitoreoCalibradoresService {
  API_URL = "http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getCajasPorLinea(id_calibrador: number, id_turno: number) {
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_cajas_por_linea/${id_calibrador}/${id_turno}`, { observe: 'response' });
  }

  getProductionLine2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string, id_line: number, name_line: string) {
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_production_line2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}/${id_line}/${name_line}`, { observe: 'response' });
  }
  /***********************************************************************************************************************************************************/
  getProduccionSearch2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string) {
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_produccion_turno2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}`);
  }
  /***********************************************************************************************************************************************************/


  /***********************************************************************************************************************************************************/
  getAverageforMinute2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string, lineas_length: number) {
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_produccion_minuto2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}/${lineas_length}`);
  }
  /***********************************************************************************************************************************************************/

  /***********************************************************************************************************************************************************/
  getAverageforMinuteLastHour2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string, lineas_length:number) {
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_produccion_minuto_ultima_hora2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}/${lineas_length}`);
  }
  /***********************************************************************************************************************************************************/

  getGetLastTurno() {
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_last_turno/`);
  }


}
