import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-chatlayout',
  templateUrl: './chatlayout.component.html',
  styleUrls: ['./chatlayout.component.scss'],
  providers:[
    AuthService
  ]
})
export class ChatlayoutComponent implements OnInit {

  constructor( private authService:AuthService) { }

  ngOnInit(): void {


  }

}


