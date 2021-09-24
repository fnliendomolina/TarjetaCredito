import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Response } from '../models/Response';

@Injectable({
  providedIn: 'root'
})
export class TarjetaService {

  public url = "https://localhost:44337/api/tarjeta";
  constructor(private _http:HttpClient) { 

  }

  getListTarjetas(): Observable<Response> {
    return this._http.get<Response>(this.url);
  }

  deleteTarjeta(id: number): Observable<Response> {
    return this._http.delete<Response>(this.url + "/" + id);
  }

  saveTarjeta(tarjeta: any) {
    return this._http.post<Response>(this.url,tarjeta);
  }

  editTarjeta(tarjeta: any, id?:number) {
    return this._http.put<Response>(this.url + "/" + id ,tarjeta);
  }
}
