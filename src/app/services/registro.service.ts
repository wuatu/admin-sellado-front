import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registro } from '../models/registro';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getRegistros(){
    return this.httpClient.get(`${this.API_URL}/registros`);    
  }
  postRegistro(registro:Registro){
    return this.httpClient.post(`${this.API_URL}/registro`,registro);    
  }

}
