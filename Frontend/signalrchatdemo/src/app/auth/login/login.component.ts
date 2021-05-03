import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { parseApiErrors } from '../../shared/utils/parseErrors';
import { NotificationService } from '../../shared/services/notification.service';
import { LoadingOverlayService } from '../../shared/services/loading-overlay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit,OnDestroy {

  private $loginSuscription!:Subscription
  loginFormGroup!:FormGroup
  constructor(private authService:AuthService,
    private formBuilder:FormBuilder,
    private router:Router,
    private notification:NotificationService,
    private loadingService:LoadingOverlayService) {
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

  login()
  {
      this.loginFormGroup.markAllAsTouched();
      if(!this.loginFormGroup.valid){
        return;
      }
     this.$loginSuscription=  this.loadingService.
      interceptObservableAndShowLoading(this.authService.login(this.loginFormGroup.value))
      .subscribe(( )=>{
        this.router.navigate(['/chat']);
      },
      (err)=>
      this.notification
      .showError('Han ocurrido errores durante el inicio de sesion',parseApiErrors(err).join('<br>'))
      );
  }

  ngOnDestroy(): void {
    this.$loginSuscription?.unsubscribe();
  }

}
