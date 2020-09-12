import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioEnLinea } from '../models/usuario-en-linea';
import { Observable, from } from 'rxjs';
import { ExportUsuarioEnLinea } from '../models/export-usuario-en-linea';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEnLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getUsuariosEnLinea(idLinea:string, idCalibrador:string, rutUsuario:string, fromDate:string, toDate:string){
    return this.httpClient.get(`${this.API_URL}/usuarios_en_linea/${idLinea}/${idCalibrador}/${rutUsuario}/${fromDate}/${toDate}`);    
  }

  saveUsuarioEnLinea(usuarioEnLinea:UsuarioEnLinea){
    return this.httpClient.post(`${this.API_URL}/usuario_en_linea/`,usuarioEnLinea);
  }

  cerrarTurnoUsuarioEnLinea(id:number,currentUsuarioEnLineaSelected:UsuarioEnLinea){
    return this.httpClient.put(`${this.API_URL}/usuario_en_linea/${id}`,currentUsuarioEnLineaSelected);
  }

}
