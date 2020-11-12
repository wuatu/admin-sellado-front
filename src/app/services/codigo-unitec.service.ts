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
    console.log("searchBox : "+code);
    return this.httpClient.get(`${this.API_URL}/busqueda_cod_unitec/${code}`,{observe: 'response'});
  }

  postCodigoUnitec(codigoUnitec:CodigoUnitec){
    console.log("registro Dev"+ codigoUnitec);
    return this.httpClient.post(`${this.API_URL}/registros_cod_unitec`, codigoUnitec);    
  }

  /* creaRegistroDev(mensajeRegistro:string){
    let fecha = this.getFecha();
    let registro=new RegistroDev(null, '510',mensajeRegistro, fecha.substring(0,10), fecha.substring(11,19));
    this.postRegistroDev(registro).subscribe(
      res=>{
        console.log("Registro almacenado satisfactoriamente");
      }, 
      err=>{
        console.log("Error al almacenar registro");
      }
    );
  }*/


}

