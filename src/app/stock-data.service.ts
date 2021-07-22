import {HttpClient} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  
  constructor(private _http:HttpClient) {
 
   }
  getData(item:any):Observable<any>{
      return  this._http.get(`https://test.solutions.vwdservices.com/internal/intake-test/sample-data/price-data/${item}`)
  }
}
