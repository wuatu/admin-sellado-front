import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  API_URL = "http://monitoreo.dan:3000/api"
  constructor(private httpClient: HttpClient) { }

  getTurnos(selectedfromDate: string, selectedToDate: string) {
    return this.httpClient.get(`${this.API_URL}/turnos/${selectedfromDate}/${selectedToDate}`,{observe: 'response'});
  }

  getTurno(id: string) {
    return this.httpClient.get(`${this.API_URL}/turno/${id}`);
  }

  getTurnoSinId(fk_calibrador: number) {
    return this.httpClient.get(`${this.API_URL}/turno_id/${fk_calibrador}`,{observe: 'response'});
  }

  deleteTurno(id: string) {
    return this.httpClient.delete(`${this.API_URL}/turno/${id}`);
  }

  saveTurno(turno: Turno) {
    return this.httpClient.post(`${this.API_URL}/turno`, turno);
  }

  updateTurno(fecha_apertura: string, turno: Turno): Observable<any> {
    return this.httpClient.put(`${this.API_URL}/turno/${fecha_apertura}`, turno);
  }

  closeTurnCollaborators(fecha_termino:string, hora_termino:string, fk_calibrador: number):Observable<any>{
    console.log("closeTurnCollaborators");
    return this.httpClient.put(`${this.API_URL}/turno/${fecha_termino}/${hora_termino}/${fk_calibrador}`,"",{observe: 'response'});
  }
}
