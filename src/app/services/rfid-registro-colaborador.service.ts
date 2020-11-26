import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RfidRegistroColaborador } from '../models/rfid-registro-colaborador';

@Injectable({
  providedIn: 'root'
})
export class RfidRegistroColaboradorService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getRfidsRegisterCollaborator(){
    return this.httpClient.get(`${this.API_URL}/rfids_registro_colaborador/`,{observe: 'response'});
  }

  getRfidRegisterCollaborator(id:number){
    return this.httpClient.get(`${this.API_URL}/rfid_registro_colaborador/${id}`,{observe: 'response'});
  }

  deleteRfidRegisterCollaborator(id:number){
    return this.httpClient.delete(`${this.API_URL}/rfid_registro_colaborador/${id}`);
  }

  saveRfidRegisterCollaborator(rfidRegistroColaborador:RfidRegistroColaborador){
    return this.httpClient.post(`${this.API_URL}/rfid_registro_colaborador/`, rfidRegistroColaborador);
  }

  updateRfidRegisterCollaborator(id:number, rfidRegistroColaborador:RfidRegistroColaborador):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/rfid_registro_colaborador/${id}`,rfidRegistroColaborador);
  }

}
