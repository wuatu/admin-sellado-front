import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Configuracion } from '../models/configuracion';
@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getMaxWaitTime(){
    console.log("getMaxWaitTime");
    return this.httpClient.get(`${this.API_URL}/minutes`);
  }

  updateMaxWaitTime(id_minute:number, configuracion:Configuracion):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/minutes_wait/${id_minute}`,configuracion);
  }
}
