import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MonitoreoService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getProduccionSearch(id_caliper:number, date: string, time: string, option: string){
    console.log("Service  getProduccionSearch");
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_turno/${id_caliper}/${date}/${time}/${option}`);
  }
  
  getAverageforMinute(id_caliper:number, date: string, time: string, option: string){
    console.log("Service  getAverageforMinute");
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto/${id_caliper}/${date}/${time}/${option}`);
  }
  
  getAverageforMinuteLastHour(id_caliper:number, date: string, time: string, option: string){
    console.log("Service  getAverageforMinuteLastHour");
    return this.httpClient.get(`${this.API_URL}/monitoreo_produccion_minuto_ultima_hora/${id_caliper}/${date}/${time}/${option}`);
  }
  
  getGetLastTurno(){
    console.log("Service  getGetLastTurno");
    return this.httpClient.get(`${this.API_URL}/monitoreo_last_turno/`);
  }
  

}
