import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient:HttpClient) {
   }
  registerData(registerValues:any):Observable<any>{
    return this._HttpClient.post(``,registerValues)
  }
  loginData(loginValues:any):Observable<any>{
    return this._HttpClient.post(``,loginValues)
  }
}
