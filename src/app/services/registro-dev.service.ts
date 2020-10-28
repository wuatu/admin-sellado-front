import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { RegistroDev } from '../models/registro-dev';

@Injectable({
  providedIn: 'root'
})
export class RegistroDevService {
  API_URL="http://localhost:3000/api"
  constructor(
    private httpClient: HttpClient, 
    private utilsService:UtilsService
    ) { }

  getRegistrosDev(){
    return this.httpClient.get(`${this.API_URL}/registros_dev`,{observe: 'response'});    
  }
  postRegistroDev(registroDev:RegistroDev){
    console.log("registro Dev"+ registroDev);
    return this.httpClient.post(`${this.API_URL}/registro_dev`,registroDev);    
  }

  getFecha():string{
    return this.utilsService.getFecha();
  }

  creaRegistroDev(mensajeRegistro:string){
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
  }


}

