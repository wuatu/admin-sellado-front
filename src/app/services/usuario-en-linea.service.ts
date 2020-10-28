import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioEnLinea } from '../models/usuario-en-linea';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEnLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getUsuariosEnLinea(idLinea:string, idCalibrador:string, rutUsuario:string, fromDate:string, toDate:string){
    return this.httpClient.get(`${this.API_URL}/usuarios_en_linea/${idLinea}/${idCalibrador}/${rutUsuario}/${fromDate}/${toDate}`,{observe: 'response'});    
  }

  saveUsuarioEnLinea(usuarioEnLinea:UsuarioEnLinea){
    console.log("saveUsuarioEnLinea");
    return this.httpClient.post(`${this.API_URL}/usuario_en_linea/`,usuarioEnLinea);
  }

  getValidationCollaborator(id_turno:number, id_usuario:number, id_linea:number){
    return this.httpClient.get(`${this.API_URL}/usuarios_en_linea/${id_turno}/${id_usuario}/${id_linea}`);    
  }
  
  closeTurnCollaborator(id_turno:number, id_usuario:number, id_linea:number, fecha_termino:string, hora_termino:string):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/usuarios_en_linea/${id_turno}/${id_usuario}/${id_linea}/${fecha_termino}/${hora_termino}`,"");    
  }

}
