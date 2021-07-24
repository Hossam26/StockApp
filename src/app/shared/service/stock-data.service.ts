import {HttpClient} from "@angular/common/http";
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from "../interface/stock";

@Injectable({
  providedIn: 'root'
})
export class StockDataService {
  allStocks:Stock[]=[];
   newStocks:Stock[]=[];
   deletedStocks:Stock[]=[]
  constructor(private _http:HttpClient) {
 
   }
  getData(item:any):Observable<any>{
      return  this._http.get(`https://test.solutions.vwdservices.com/internal/intake-test/sample-data/price-data/${item}`)
  }

  addNewStock(newStock:Stock){
    this.allStocks=this.allStocks.filter((item:any)=>{
      return  item.vwdKey.toLowerCase()!=newStock.vwdKey.toLowerCase()
    })
    this.allStocks.push(newStock)
    this.newStocks.push(newStock)
    localStorage.setItem("addations",JSON.stringify(this.newStocks))
     return this.allStocks
  }
  removeStock(stock:Stock){
    this.allStocks=this.allStocks.filter((item:Stock)=>{
         return  item.vwdKey!=stock.vwdKey
    })
    this.deletedStocks.push(stock)
    localStorage.setItem("deletions",JSON.stringify(this.deletedStocks))
    return this.allStocks

  }
  retrievePrevData(){
    if(localStorage.getItem("addations")){
      this.newStocks=JSON.parse(localStorage.getItem("addations")||"{}")
      this.newStocks.forEach(element => {
        this.allStocks=this.allStocks.filter((item:any)=>{
          return item.vwdKey.toLowerCase()!=element.vwdKey.toLowerCase()
        })
        this.allStocks.push(element)
      });
      
    }
    if(localStorage.getItem("deletions")){
      this.deletedStocks=JSON.parse(localStorage.getItem("deletions")||"{}")
      this.deletedStocks.forEach(element => {
        this.allStocks=this.allStocks.filter((item:any)=>{
          return item.vwdKey.toLowerCase()!=element.vwdKey.toLowerCase()
        })
      });
      
    }
    return this.allStocks
  }
}
