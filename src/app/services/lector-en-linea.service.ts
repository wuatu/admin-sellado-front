import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LectorEnLineaService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getLectorEnLinea(id:number){
    return this.httpClient.get(`${this.API_URL}/lector_linea/${id}`,{observe: 'response'});
  }

  
}
