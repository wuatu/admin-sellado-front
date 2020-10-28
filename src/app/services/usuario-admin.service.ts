import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Administrador} from '../models/administrador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioAdminService {

  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }
  
  getUsersAdmin(){
    return this.httpClient.get(`${this.API_URL}/user_admin`,{observe: 'response'});
  }

  getUserAdmin(id:string){
    console.log("getUserAdmin");
    return this.httpClient.get(`${this.API_URL}/user_admin_/${id}`,{observe: 'response'});
  }

  deleteUserAdmin(id:string){
    return this.httpClient.delete(`${this.API_URL}/user_admin/${id}`);
  }

  saveUserAdmin(administrador:Administrador){
    console.log("saveUserAdmin"+administrador);
    return this.httpClient.post(`${this.API_URL}/user_admin/`,administrador);
  }

  updateUserAdmin(id:string, administrador:Administrador):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/user_admin/${id}`,administrador);
  }
  
}

