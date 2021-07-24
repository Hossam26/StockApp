import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, timer } from "rxjs";
import { CurrencyService } from "../shared/service/currency.service";
import { StockDataService } from "../shared/service/stock-data.service";
import { Stock } from '../shared/interface/stock';
@Component({
  selector: 'app-buying-cart',
  templateUrl: './buying-cart.component.html',
  styleUrls: ['./buying-cart.component.scss']
})
export class BuyingCartComponent implements OnInit {
 myShares:Stock[]=[]
 totalBought=0
 totalCur=0
 totalYield=0
 totalQuantity=0
  constructor(private _StockService:StockDataService) {
       this.myShares=JSON.parse(localStorage.getItem("myShares")||"{}")
       this.myShares.forEach(element => {
        this.totalBought+=element.open
         this.totalQuantity+=element.quantity
       });
  }
  getCurValue(stock:any) {
    let currentVal=Number(stock.price*stock.volume)
    this.totalCur+=currentVal
  
    return currentVal
  }   
getYield(stock:any){

  let yieldVal= Number((((this.getCurValue(stock)-stock.price)/stock.price)*100))
  this.totalYield+=yieldVal
  return yieldVal.toPrecision(3)
}
   
 


 











 

  ngOnInit(): void {
  }

}
