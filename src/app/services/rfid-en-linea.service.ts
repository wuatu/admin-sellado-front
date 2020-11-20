import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RfidEnLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getRfidEnLinea(id:number){
    return this.httpClient.get(`${this.API_URL}/rfid_linea/${id}`,{observe: 'response'});
  }

  
}

