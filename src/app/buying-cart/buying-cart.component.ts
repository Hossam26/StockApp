import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, timer } from "rxjs";
import { ToastrService } from 'ngx-toastr';
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
  constructor(private _StockService:StockDataService,private _Toastr:ToastrService) {
      this.UpdateShares()  
  }
UpdateShares(){
 this.totalBought=0
 this.totalCur=0
 this.totalYield=0
 this.totalQuantity=0
  this.myShares=JSON.parse(localStorage.getItem("myShares")||"{}")
  this.myShares.forEach(element => {
   this.totalBought+=element.open
    this.totalQuantity+=element.quantity
    this.totalCur+=this.getCurValue(element)
    this.totalYield+=this.getYield(element)
  });
}
  sellStock(stock:Stock){
    let mssg=this._StockService.sellStock(stock)
    if(mssg.includes("no")==true){
     this._Toastr.error(mssg)
 
    }
    else{
     this._Toastr.success(mssg)
 
    }
 
this.UpdateShares()
 }

 
  getCurValue(stock:any) {
    let currentVal=Number(stock.price*stock.volume)
  
    return currentVal
  }   
getYield(stock:any){

  let yieldVal= Number((((this.getCurValue(stock)-stock.price)/stock.price)*100))
  return yieldVal
}
   
 


 











 

  ngOnInit(): void {
  }

}
