import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LectorValidador } from '../models/lector-validador';
@Injectable({
  providedIn: 'root'
})
export class LectorValidadorService {

  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getLectoresValidador(id:number){
    return this.httpClient.get(`${this.API_URL}/lectoresValidador/${id}`);
  }
  getLectoresValidadorId(id_calibrador:number){
    console.log("getLectoresValidadorId");
    return this.httpClient.get(`${this.API_URL}/lectoresValidador/${id_calibrador}`);
  }

  getLectorValidador(id:number){
    return this.httpClient.get(`${this.API_URL}/lectoresValidador/${id}`);
  }

  deleteLectorValidador(id:number){
    console.log("deleteLectorValidador");
    return this.httpClient.delete(`${this.API_URL}/lectorValidador/${id}`);
  }

  saveLectorValidador(lectorValidador:LectorValidador){
    console.log("saveLectorValidador");
    console.log(lectorValidador);
    return this.httpClient.post(`${this.API_URL}/lectorValidador/`,lectorValidador);
  }

  updateLectorValidador(id:number, lectorValidador:LectorValidador):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/lectorValidador/${id}`,lectorValidador);
  }
}
