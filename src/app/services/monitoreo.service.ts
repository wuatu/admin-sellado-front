import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getProduccionSearch( date: string, time: string,id_caliper:number, option: string,fecha_actual: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_turno/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  
  getAverageforMinute( date: string, time: string,id_caliper:number, option: string,fecha_actual: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  
  getAverageforMinuteLastHour( date: string, time: string, id_caliper:number,option: string,fecha_actual: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto_ultima_hora/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  
  getGetLastTurno(){
    return this.httpClient.get(`${this.API_URL}/monitoreo_last_turno/`,{observe: 'response'});
  }
  

}
