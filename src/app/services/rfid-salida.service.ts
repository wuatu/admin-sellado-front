import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RfidSalida } from '../models/rfid-salida';

@Injectable({
  providedIn: 'root'
})
export class RfidSalidaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getRfids(id_calibrador:string,id_linea:string){
    return this.httpClient.get(`${this.API_URL}/rfids_salida/${id_calibrador}/${id_linea}`,{observe: 'response'});
  }

  getRfid(id:number){
    return this.httpClient.get(`${this.API_URL}/rfid_salida/${id}`,{observe: 'response'});
  }

  deleteRfid(id:number){
    return this.httpClient.delete(`${this.API_URL}/rfid_salida/${id}`);
  }

  saveRfid(rfid_salida:RfidSalida){
    return this.httpClient.post(`${this.API_URL}/rfid_salida/`,rfid_salida);
  }

  updateRfid(id:number, rfid_salida:RfidSalida):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/rfid_salida/${id}`,rfid_salida);
  }

}
