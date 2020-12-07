import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
/***********************************************************************************************************************************************************/ 
  getProduccionSearch( date: string, time: string,id_caliper:number, option: string,fecha_actual: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_turno/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  getProduccionSearch2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_turno2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}`);
  }
/***********************************************************************************************************************************************************/

/***********************************************************************************************************************************************************/
  getAverageforMinute( date: string, time: string,id_caliper:number, option: string,fecha_actual: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  getAverageforMinute2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}`);
  }
/***********************************************************************************************************************************************************/

/***********************************************************************************************************************************************************/
  getAverageforMinuteLastHour( date: string, time: string, id_caliper:number,option: string,fecha_actual: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto_ultima_hora/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  getAverageforMinuteLastHour2(id_caliper: number, id_turno: number, fecha_apertura: string, hora_apertura: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto_ultima_hora2/${id_caliper}/${id_turno}/${fecha_apertura}/${hora_apertura}`);
  }
/***********************************************************************************************************************************************************/

  getLastTurno(fk_calibrador:number){
    console.log("getLastTurno");
    return this.httpClient.get(`${this.API_URL}/monitoreo_last_turno/${fk_calibrador}`,{observe: 'response'});
  }
  

}
