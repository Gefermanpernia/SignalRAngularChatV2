import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { AuthRoutingModule } from './authRouting/authRouting.Module';
import { AuthlayoutComponent } from './authlayout/authlayout.component';
import { RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';

import { HttpClientModule} from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LoginComponent,
    AuthlayoutComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
