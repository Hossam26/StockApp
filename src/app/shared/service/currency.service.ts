import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from "@angular/common/http";
@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private _http:HttpClient) { }
  getCountries():Observable<any>{
    return  this._http.get(`https://free.currconv.com/api/v7/currencies?apiKey=29a9b36decab1289bf83`)
}
}
