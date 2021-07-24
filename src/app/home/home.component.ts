import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, of, from, Subject } from 'rxjs';
import { mergeMap, tap, takeUntil } from 'rxjs/operators';
import { CurrencyService } from "../shared/service/currency.service";
import { StockDataService } from "../shared/service/stock-data.service";
import { Stock } from '../shared/interface/stock';
import { ToastrService } from 'ngx-toastr';
declare var $:any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _StockService:StockDataService, private _Toastr:ToastrService, private _Currency:CurrencyService) {

   }

   ngOnInit(): void {
    this.refershPrice()
    this.getAllStocks()
  
  }

   private destory$: Subject<void> = new Subject();


   allStocks:Stock[]=[];
   totalBought=0
   totalCur=0;
   totalYield=0
   symbols=of(
     "AEX.NL",
     "AALB.NL",
    "ABN.NL",
    "ADYEN.NL",
    "AGN.NL",
    "AD.NL",
    "AKZA.NL",
    "MT.NL",
    "ASML.NL",
    "ASRNL.NL",
    "DSM.NL",
    "GLPG.NL",
    "HEIA.NL",
    "IMCD.NL",
    "INGA.NL",
    "KPN.NL",
    "NN.NL",
    "PHIA.NL",
    "RAND.NL",
    "REN.NL",
    "RDSA.NL",
    "TKWY.NL",
    "URW.NL",
    "UNA.NL"
   )
   lastDataIndex=24
  
   addForm=new FormGroup({
    vwdKey:new FormControl('',Validators.required,),
     volume:new FormControl('',Validators.required),
     open:new FormControl('',Validators.required),
    
   });
 
   
 
   

 getAllStocks(){
  from(this.symbols)
  .pipe(
    mergeMap((symbol) => this._StockService.getData(symbol)), // looping through symbols then Sending multiple parallel HTTP requests
    tap(console.log),
    takeUntil(this.destory$)
  )
  .subscribe(
    (res: Stock) => {
      this.totalBought += Number(res.open);
      this.allStocks.push(res);
      if (this.allStocks.length==this.lastDataIndex) {
        this.retrieveData();
      }
    },
    (error) => {
      console.log(error);
    }
  );

  
    
   
    
   
    }
  

    refershPrice() {
      let time = interval(5000);
      time.pipe(
        takeUntil(this.destory$)
      ).
      subscribe(() => {
        this.allStocks.forEach((element: Stock) => {
          const vwdkey = element.vwdKey?.toLocaleUpperCase();
          this._StockService.getData(vwdkey || '').subscribe((res) => {
            element.price = res.price;
          });
        });
      });
    }

addStock(){
let newStock={
  vwdKey:this.addForm.controls.vwdKey.value,
  name:"",
  price:0,
  volume:this.addForm.controls.volume.value,
  open:this.addForm.controls.open.value,
  quantity:0,
  current:0,
  yield:0
}
this.allStocks=this._StockService.addNewStock(newStock)
$('#addStock').modal('hide')
this.reset()

}


deleteStock(stock:Stock){
  this.allStocks= this._StockService.removeStock(stock)
}

 retrieveData(){
   this._StockService.allStocks=this.allStocks
  this.allStocks=this._StockService.retrievePrevData()
  
}

buyStock(stock:Stock){
   let mssg=this._StockService.buyStock(stock)
   this._Toastr.success(mssg)

}
sellStock(stock:Stock){
   let mssg=this._StockService.sellStock(stock)
   if(mssg.includes("no")==true){
    this._Toastr.error(mssg)

   }
   else{
    this._Toastr.success(mssg)

   }

   
}


getCurrentValue(stock:any) {
  const currentValue = stock.price || 0;
    const quantity = stock.volume || 0;
   
  let currentVal= (currentValue as number) * quantity;
  this.totalCur+=currentVal

  return currentVal
}


getYield(stock:any){
  const currentValue = this.getCurrentValue(stock) || 0;
  const price = stock.price || 0;
  let yieldVal=  (((currentValue as number) - price) / price) * 100;
  this.totalYield+=yieldVal
  return yieldVal.toPrecision(3)
}



reset(){
  this.addForm.controls.vwdKey.setValue("")
  this.addForm.controls.volume.setValue("")
  this.addForm.controls.previousClose.setValue("")
  
  }

ngOnDestroy() {
  this.destory$.unsubscribe();
}
}
