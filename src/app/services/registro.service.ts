import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registro } from '../models/registro';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {
  API_URL="http://localhost:3000/api"
  constructor(
    private httpClient: HttpClient, 
    private utilsService:UtilsService
    ) { }

  getRegistros(){
    return this.httpClient.get(`${this.API_URL}/registros`);    
  }
  postRegistro(registro:Registro){
    console.log(registro);
    return this.httpClient.post(`${this.API_URL}/registro`,registro);    
  }

  getFecha():string{
    return this.utilsService.getFecha();
  }

  creaRegistro(mensajeRegistro:string){
    const user = JSON.parse(localStorage.getItem('USER'));
    let fecha = this.getFecha();
    let registro=new Registro(null,user.id,user.nombre,user.apellido,mensajeRegistro, fecha.substring(0,10), fecha.substring(11,19));
    this.postRegistro(registro).subscribe(
      res=>{
        console.log("Registro almacenado satisfactoriamente");
      }, 
      err=>{
        console.log("Error al almacenar registro");
      }
    );
  }


}
