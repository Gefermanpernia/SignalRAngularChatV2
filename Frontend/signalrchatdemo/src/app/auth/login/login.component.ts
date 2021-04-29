import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginFormGroup!:FormGroup
  constructor(private authService:AuthService,
    private formBuilder:FormBuilder,
    private router:Router) {
      this.initializeForm();
     }

     private initializeForm()
     {
      this.loginFormGroup = this.formBuilder.group(
        {
          email:['',[Validators.required,Validators.email]],
          password:['',[Validators.required]]
        }
      )
     }

     getPasswordError(){
      if(!this.loginFormGroup.get('password')?.touched)
      {return null;}

      return this.loginFormGroup.get('password')?.invalid?
      "Please enter your password"
      :null
     }

     getEmailError(){
       if(!this.loginFormGroup.get('email')?.touched)
       {return null;}

       if(this.loginFormGroup.get('email')?.invalid){
         return this.loginFormGroup.get('email')?.hasError('email') ?
         "You need to enter a valid email address"
         :"Email is required"
       }
       return null;
     }




  ngOnInit(): void {
  }

  login(){
      this.loginFormGroup.markAllAsTouched();
      if(!this.loginFormGroup.valid){
        return;
      }
      debugger
      this.authService.login(this.loginFormGroup.value)
      .subscribe((r )=>{
        this.router.navigate(['/chat']);


      },(err)=>{console.log(err);});
  }

}
