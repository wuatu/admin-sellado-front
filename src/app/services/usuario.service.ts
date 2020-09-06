import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario} from '../models/usuario';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getUsuarios(){
    return this.httpClient.get(`${this.API_URL}/usuarios`);
  }
  

  getUsuario(id:string){
    return this.httpClient.get(`${this.API_URL}/usuario/${id}`);
  }

  deleteUsuario(id:string){
    return this.httpClient.delete(`${this.API_URL}/usuario/${id}`);
  }

  saveUsuario(usuario:Usuario){
    return this.httpClient.post(`${this.API_URL}/usuario/`,usuario);
  }

  updateUsuario(id:string, usuario:Usuario):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/usuario/${id}`,usuario);
  }
}
