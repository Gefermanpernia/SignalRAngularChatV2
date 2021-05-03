import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/services/notification.service';
import { parseApiErrors } from '../../shared/utils/parseErrors';
import { LoadingOverlayService } from '../../shared/services/loading-overlay.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy{

  $registerSuscription!:Subscription
  constructor(private formBuilder:FormBuilder,
    private authService:AuthService,
    private router:Router,
    private notification:NotificationService,
    private loadingService:LoadingOverlayService) {
        this.buildFormGroup();

    }


  registerFormGroup!:FormGroup;
  ngOnInit(): void {

  }

  buildFormGroup(){
    this.registerFormGroup = this.formBuilder.group({
      email:['',[Validators.required,Validators.email]],
      username:['',[Validators.required]],
      password:['',Validators.required]
    })
  }

  formFieldIsValid(fieldName:string) :boolean{
    let field = this.registerFormGroup.get(fieldName);
    if(field){
        return field.valid || !field.touched
    }
    return true;
  }

  register(){

    this.registerFormGroup.markAllAsTouched();

    if(!this.registerFormGroup.valid){
        return;
    }

    this.$registerSuscription= this.loadingService
    .interceptObservableAndShowLoading(this.authService.register(this.registerFormGroup.value))
    .subscribe(
      ()=> {
      this.router.navigate(['/chat/choicechat']);
    }, (err) => {
      const errors = parseApiErrors(err).join('<br>');
      console.log(errors);
      this.notification.showError(
      "Han ocurrido errores durante el registro",
      errors
      );
    });

  }

  ngOnDestroy(): void {
    this.$registerSuscription?.unsubscribe();

}

}
