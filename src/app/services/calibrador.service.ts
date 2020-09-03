import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Calibrador } from '../models/calibrador';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalibradorService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getCalibradores(){
    return this.httpClient.get(`${this.API_URL}/calibradores`);
  }

  getCalibrador(id:string){
    return this.httpClient.get(`${this.API_URL}/calibrador/${id}`);
  }

  deleteCalibrador(id:string){
    return this.httpClient.delete(`${this.API_URL}/calibrador/${id}`);
  }

  saveCalibrador(calibrador:Calibrador){
    console.log(calibrador);
    return this.httpClient.post(`${this.API_URL}/calibrador/`,calibrador);
  }

  updateCalibrador(id:string, calibrador:Calibrador):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/calibrador/${id}`,calibrador);
  }

}
