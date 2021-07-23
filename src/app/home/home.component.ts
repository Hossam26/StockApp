import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockDataService } from "../stock-data.service";
import { interval, timer } from "rxjs";
import { waitForAsync } from '@angular/core/testing';
declare var $:any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private _StockService:StockDataService) {

    this.getAllStocks()
   }


   allStocks:any[]=[];
   newStocks:any[]=[];
   deletedStocks:any[]=[]
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
     name:new FormControl('',Validators.required,),
     price:new FormControl('',Validators.required),
     volume:new FormControl('',Validators.required),
     open:new FormControl('',Validators.required),
     previousClose :new FormControl('',Validators.required),
     



   });
 
   
 
   
 

 getAllStocks(){
  
    for(let i=0;i<this.data.length;i++){
      
      this._StockService.getData(this.data[i]).subscribe((res)=>{
        res.current=this.getCurValue(res)
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
          this._StockService.getData(element.vwdKey).subscribe((res)=>{
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
  volume:this.addForm.controls.volume.value,
  open:this.addForm.controls.open.value,
  previousClose:this.addForm.controls.previousClose.value,
}
this.allStocks=this.allStocks.filter((item:any)=>{
  return  item.vwdKey!=newStock.vwdKey
})
this.allStocks.push(newStock)
this.newStocks.push(newStock)
$('#addStock').modal('hide')
this.reset()
localStorage.setItem("addations",JSON.stringify(this.newStocks))
}



deleteStock(stock:any){
  this.allStocks=this.allStocks.filter((item:any)=>{
       return  item.vwdKey!=stock.vwdKey
  })
  this.deletedStocks.push(stock)
  localStorage.setItem("deletions",JSON.stringify(this.deletedStocks))

}



 retrieveData(){
  if(localStorage.getItem("addations")){
    this.newStocks=JSON.parse(localStorage.getItem("addations")||"{}")
    this.newStocks.forEach(element => {
      this.allStocks=this.allStocks.filter((item:any)=>{
        return item.vwdKey!=element.vwdKey
      })
      this.allStocks.push(element)
    });
    
  }
  if(localStorage.getItem("deletions")){
    this.deletedStocks=JSON.parse(localStorage.getItem("deletions")||"{}")
    this.deletedStocks.forEach(element => {
      this.allStocks=this.allStocks.filter((item:any)=>{
        return item.vwdKey!=element.vwdKey
      })
    });
    
  }
  
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
