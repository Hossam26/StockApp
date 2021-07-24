import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, timer } from "rxjs";
import { CurrencyService } from "../shared/service/currency.service";
import { StockDataService } from "../shared/service/stock-data.service";
import { Stock } from '../shared/interface/stock';
declare var $:any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _StockService:StockDataService,private _Currency:CurrencyService) {

    this.getAllStocks()
   }


   allStocks:Stock[]=[];
   totalBought=0
   totalCur=0;
   totalYield=0
   data=["AEX.NL","AALB.NL",
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
  ]
   
  
   addForm=new FormGroup({
    vwdKey:new FormControl('',Validators.required,),
     volume:new FormControl('',Validators.required),
     open:new FormControl('',Validators.required),
    
   });
 
   
 
   

 getAllStocks(){
  
    for(let i=0;i<this.data.length;i++){
      
      this._StockService.getData(this.data[i]).subscribe((res)=>{
        res.current=this.getCurValue(res).toPrecision(3)
        res.yield=this.getYield(res)
       
        res.yield=res.yield.toPrecision(3)
        this.totalBought+=Number(res.open)
        this.totalCur+=Number(res.current)
        this.totalYield+=Number(res.yield)
        this.allStocks.push(res)
        
      
        if(i==this.data.length-1){

          this.retrieveData()
        }
      })
      
    }
    let time=interval(5000)
      time.subscribe(()=>{
        this.allStocks.forEach(element => {
          this._StockService.getData(element.vwdKey.toUpperCase()).subscribe((res)=>{
                 element.price=res.price
          })
        });
      })
   
    
   
    }
  getCurValue(stock:any) {
    return stock.price*stock.volume
  }


addStock(){
let newStock={
  vwdKey:this.addForm.controls.vwdKey.value,
  name:"",
  price:0,
  volume:this.addForm.controls.volume.value,
  open:this.addForm.controls.open.value,
  current:0,
  yield:0
}
this.allStocks=this._StockService.addNewStock(newStock)
$('#addStock').modal('hide')
this.reset()

}



deleteStock(stock:Stock){
  this.allStocks=this._StockService.removeStock(stock)
}



 retrieveData(){
   this._StockService.allStocks=this.allStocks
  this.allStocks=this._StockService.retrievePrevData()
  
}
getYield(stock:any){
  return  Number((((stock.current-stock.price)/stock.price)*100))
}



reset(){
  this.addForm.controls.vwdKey.setValue("")
  this.addForm.controls.volume.setValue("")
  this.addForm.controls.previousClose.setValue("")
  
  }
ngOnInit(): void {
}
}
