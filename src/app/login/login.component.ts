import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthGuardService } from '../auth-guard.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private _AuthService:AuthService, private _Router:Router,private _AuthGuardService:AuthGuardService, private _Toastr:ToastrService) { }
  loginForm:FormGroup=new FormGroup({
    'email':new FormControl(null,[Validators.required,Validators.email]),
    'password':new FormControl(null,[Validators.required,Validators.pattern(/[A-Za-z]{1,}[0-9]{1,}/),Validators.minLength(8)]),

  })
  login(){
    if(this.loginForm.invalid){
      return 
    }
    this._AuthService.loginData(this.loginForm.value).subscribe((data)=>{
      
      if(data.message=="success"){
         localStorage.setItem("checked","true")
         localStorage.setItem("token",data.token)

         this._Toastr.success(`Welcome ${data.user.first_name}`)
         this._AuthGuardService.isLogin.next(true)
         this._Router.navigateByUrl("/home")

       }
       else{
        this._Toastr.error(data.message)
       }
    })
  }
  ngOnInit(): void {
  }

}
