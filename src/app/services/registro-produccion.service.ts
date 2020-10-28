import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { RegistroProduccion } from '../models/registro-produccion';

@Injectable({
  providedIn: 'root'
})
export class RegistroProduccionService {
  API_URL="http://localhost:3000/api"
  constructor(
    private httpClient: HttpClient, 
    private utilsService:UtilsService
    ) { }

  getRegistrosProduccion(){
    return this.httpClient.get(`${this.API_URL}/registros_produccion`,{observe: 'response'});    
  }
  

  


}
