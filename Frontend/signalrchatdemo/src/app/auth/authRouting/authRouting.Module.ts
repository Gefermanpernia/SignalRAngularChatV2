import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router'
import { LoginComponent } from '../login/login.component';
import { AuthlayoutComponent } from '../authlayout/authlayout.component';
import { RegisterComponent } from '../register/register.component';

const routes:Routes =
[

  {
    path:'',
    component:AuthlayoutComponent,
    children:[
      {
        component:LoginComponent,
        path:'login'

      },
      {
        component:RegisterComponent,
        path:'register'
      },
      {
        path:'**',
        pathMatch:'full',
        redirectTo:'auth/login'
      }
    ]
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class AuthRoutingModule { }
