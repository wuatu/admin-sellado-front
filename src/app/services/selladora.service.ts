import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Selladora } from '../models/selladora';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelladoraService {
  API_URL="http://localhost:3000/api"
  constructor(private httpClient: HttpClient) { }

  getSelladoras(){
    return this.httpClient.get(`${this.API_URL}/selladora`);
  }

  getSelladora(id:string){
    return this.httpClient.get(`${this.API_URL}/selladora/${id}`);
  }

  deleteSelladora(id:string){
    return this.httpClient.delete(`${this.API_URL}/selladora/${id}`);
  }

  saveSelladora(selladora:Selladora){
    console.log(selladora);
    return this.httpClient.post(`${this.API_URL}/selladora/`,selladora);
  }

  updateSelladora(id:string, selladora:Selladora):Observable<any>{
    return this.httpClient.put(`${this.API_URL}/selladora/${id}`,selladora);
  }

}
