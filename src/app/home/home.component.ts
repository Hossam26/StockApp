import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StockDataService } from "../stock-data.service";
import { interval, timer } from "rxjs";
declare var $:any

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
   decoded:any;
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
 
   
 
   
  constructor(private _StockService:StockDataService) {

    this.getAllStocks()
   }

 getAllStocks(){
   let Duration= interval(5000)
   Duration.subscribe(()=>{
     this.allStocks=[]
     this.totalBought=0
     this.totalCur=0
     this.totalYield=0
    for(let i=0;i<this.data.length;i++){
      this._StockService.getData(this.data[i]).subscribe((res)=>{
        res.current=res.price*res.volume
        res.yield=Number((((res.current-res.open)/res.open)*100)).toPrecision(3)

        this.totalBought+=Number(res.open)
        this.totalCur+=Number( res.current)
        this.totalYield+=Number(res.yield)
        this.allStocks.push(res)
      })
      
         
    }
    for(let i=0;i<this.newStocks.length;i++){
      this.allStocks=this.allStocks.filter((item:any)=>{
        return  item.vwdKey!=this.newStocks[i].vwdKey
      })
      this.allStocks.push(this.newStocks[i])
    }
    for(let i=0;i<this.deletedStocks.length;i++){
      this.allStocks=this.allStocks.filter((item:any)=>{
        return  item.vwdKey!=this.deletedStocks[i].vwdKey
   })
    }
   })
        
    }

  ngOnInit(): void {
  }
reset(){
this.addForm.controls.vwdKey.setValue("")
this.addForm.controls.name.setValue("")
this.addForm.controls.price.setValue("")
this.addForm.controls.volume.setValue("")
this.addForm.controls.open.setValue("")
this.addForm.controls.previousClose.setValue("")

}
deleteStock(stock:any){
  this.allStocks=this.allStocks.filter((item:any)=>{
       return  item.vwdKey!=stock.vwdKey
  })
  this.deletedStocks.push(stock)
 
}
addStock(){
let newStock={
  vwdKey:this.addForm.controls.vwdKey.value,
  name:this.addForm.controls.name.value,
  price:this.addForm.controls.price.value,
  volume:this.addForm.controls.volume.value,
  open:this.addForm.controls.open.value,
  previousClose:this.addForm.controls.previousClose.value,
  yield:(((this.addForm.controls.previousClose.value-this.addForm.controls.open.value)/this.addForm.controls.open.value)*100).toPrecision(3)
}
this.newStocks.push(newStock)
this.allStocks=this.allStocks.filter((item:any)=>{
  return  item.vwdKey!=newStock.vwdKey
})
this.allStocks.push(newStock)

$('#addNote').modal('hide')
}
}
