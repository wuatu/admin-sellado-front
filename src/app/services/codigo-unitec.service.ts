import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { CodigoUnitec } from '../models/codigo-unitec';


@Injectable({
  providedIn: 'root'
})
export class CodigoUnitecService {
  API_URL="http://localhost:3000/api"
  constructor(
    private httpClient: HttpClient, 
    private utilsService:UtilsService
    ) { }

  getCodigoUnitec(){
    return this.httpClient.get(`${this.API_URL}/registros_cod_unitec`,{observe: 'response'});
  }
  searchCodeUnitec(code:string){
    return this.httpClient.get(`${this.API_URL}/busqueda_cod_unitec/${code}`,{observe: 'response'});
  }
  postCodigoUnitec(codigoUnitec:CodigoUnitec){
    return this.httpClient.post(`${this.API_URL}/registros_cod_unitec`, codigoUnitec);    
  }
}

