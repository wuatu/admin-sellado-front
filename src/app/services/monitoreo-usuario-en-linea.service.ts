import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MonitoreoUsuarioEnLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getUsuariosEnLinea(idLinea:string, idCalibrador:string, id_turno:number, nombre_linea: string){
    console.log("getUsuariosEnLinea");
    return this.httpClient.get(`${this.API_URL}/monitoreo_usuarios_en_linea/${idLinea}/${idCalibrador}/${id_turno}/${nombre_linea}`,{observe: 'response'});    
  }

  closeTurnCollaborator(id_turno:number, id_usuario:number, id_linea:number, fecha_termino:string, hora_termino:string):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/monitoreo_usuarios_en_linea/${id_turno}/${id_usuario}/${id_linea}/${fecha_termino}/${hora_termino}`,"");    
  }


}
