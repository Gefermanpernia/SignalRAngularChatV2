import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  showSuccess(title:string,body:string){

    this.showSwal(title,body,"success");
  }

  showError(title:string,body:string){
    this.showSwal(title,body,"error");
  }

  showInfo(title:string,body:string){
    this.showSwal(title,body,'info');
  }
  private showSwal(title:string,body:string,type:SweetAlertIcon){
    Swal.fire({
      title,
      html:body,
      icon:type
    })

  }
}
