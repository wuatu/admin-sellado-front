import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UsuarioEnLinea } from '../models/usuario-en-linea';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioEnLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getUsuariosEnLinea(idLinea:string, idCalibrador:string){
    return this.httpClient.get(`${this.API_URL}/usuarios_en_linea/${idLinea}/${idCalibrador}`);
    
  }
  
  saveUsuarioEnLinea(usuarioEnLinea:UsuarioEnLinea){
    return this.httpClient.post(`${this.API_URL}/usuario_en_linea/`,usuarioEnLinea);
  }

}
