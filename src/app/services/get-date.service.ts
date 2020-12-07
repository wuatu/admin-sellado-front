import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetDateService {
  API_URL="http://localhost:3000/api"

  constructor(private httpClient: HttpClient) { }

  dateGetTime(){
    return this.httpClient.get(`${this.API_URL}/get_date`);
  }

}
