import { Injectable } from '@angular/core';
import { Turno } from '../models/turno';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {
  API_URL = "http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getTurnos(selectedfromDate: string, selectedToDate: string) {
    return this.httpClient.get(`${this.API_URL}/turnos/${selectedfromDate}/${selectedToDate}`);
  }

  getTurno(id: string) {
    return this.httpClient.get(`${this.API_URL}/turno/${id}`);
  }

  getTurnoSinId() {
    return this.httpClient.get(`${this.API_URL}/turno`);
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
}
