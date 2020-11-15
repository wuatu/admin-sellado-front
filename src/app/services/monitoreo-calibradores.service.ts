import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MonitoreoCalibradoresService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getProductionLine(id_caliper:number, id_line:number, name_line: string, date: string, time: string, fecha_actual: string){
    console.log("Service  getProduccionLine");
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_production_line/${id_caliper}/${id_line}/${name_line}/${date}/${time}/${fecha_actual}`,{observe: 'response'});
  }

  getProduccionSearch( date: string, time: string, id_caliper:number,option: string, fecha_actual:string){
    console.log("Service  getProduccionSearch: "+fecha_actual);
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_produccion_turno/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  
  getAverageforMinute( date: string, time: string,id_caliper:number, option: string, fecha_actual:string){
    console.log("Service  getAverageforMinute");
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_produccion_minuto/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  
  getAverageforMinuteLastHour( date: string, time: string,id_caliper:number, option: string, fecha_actual:string){
    console.log("Service  getAverageforMinuteLastHour");
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_produccion_minuto_ultima_hora/${date}/${time}/${id_caliper}/${option}/${fecha_actual}`);
  }
  
  getGetLastTurno(){
    console.log("Service  getGetLastTurno");
    return this.httpClient.get(`${this.API_URL}/monitoreo_calibrador_last_turno/`);
  }
  

}
