import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoSistemaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getUsuariosEnLinea(idLinea:string, idCalibrador:string, nombre_linea: string){
    console.log("getUsuariosEnLinea");
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_list/${idLinea}/${idCalibrador}/${nombre_linea}`,{observe: 'response'});    
  }
  getCollaboratorsInLine(idLinea:string, idCalibrador:string, nombre_linea: string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_collaborators/${idLinea}/${idCalibrador}/${nombre_linea}`,{observe: 'response'});    
  }
  getRfidInLine(idLinea:string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_rfid/${idLinea}`,{observe: 'response'});    
  }
  getLectorInLine(idLinea:string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_lector/${idLinea}`,{observe: 'response'});    
  }
  getRfidOutInCaliper(id_calibrador:string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_rfid_out/${id_calibrador}`,{observe: 'response'});    
  }
  getLectorValidatorInCaliper(id_calibrador:string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_lector_validador/${id_calibrador}`,{observe: 'response'});    
  }
  getLastRfidOutInCaliper(id_calibrador:string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_last_rfid_salida/${id_calibrador}`,{observe: 'response'});    
  }
  getLastLectorInCaliper(id_calibrador:string){
    return this.httpClient.get(`${this.API_URL}/monitoreo_sistema_last_lector_validador/${id_calibrador}`,{observe: 'response'});    
  }

  


}