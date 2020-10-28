import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rfid } from '../models/rfid';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfidService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getRfids(id_calibrador:string,id_linea:string){
    return this.httpClient.get(`${this.API_URL}/rfids/${id_calibrador}/${id_linea}`,{observe: 'response'});
  }

  getRfid(id:number){
    return this.httpClient.get(`${this.API_URL}/rfid/${id}`,{observe: 'response'});
  }

  deleteRfid(id:number){
    return this.httpClient.delete(`${this.API_URL}/rfid/${id}`);
  }

  saveRfid(rfid:Rfid){
    console.log(rfid);
    console.log("service save !!!!!!!");
    return this.httpClient.post(`${this.API_URL}/rfid/`,rfid);
  }

  updateRfid(id:number, rfid:Rfid):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/rfid/${id}`,rfid);
  }

}
