import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador} from '../models/administrador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministradorService {

  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getUserAdmin(){
    return this.httpClient.get(`${this.API_URL}/user_admin`);
  }

  getAdministradores(){
    return this.httpClient.get(`${this.API_URL}/administradores`);
  }

  getAdministrador(id:string){
    console.log("getAdministrador");
    return this.httpClient.get(`${this.API_URL}/administrador_/${id}`);
  }

  deleteAdministrador(id:string){
    return this.httpClient.delete(`${this.API_URL}/administrador/${id}`);
  }

  saveAdministrador(administrador:Administrador){
    console.log(administrador);
    return this.httpClient.post(`${this.API_URL}/administrador/`,administrador);
  }

  updateAdministrador(id:string, administrador:Administrador):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/administrador/${id}`,administrador);
  }

  getLoginAdministrador(rut:string,password:string){
    console.log(rut,password);
    return this.httpClient.get(`${this.API_URL}/administrador/login/${rut}/${password}`);
  }

  

  getAdmin(rut:string){
    return this.httpClient.get(`${this.API_URL}/administrador/${rut}`);
  }


  
}
