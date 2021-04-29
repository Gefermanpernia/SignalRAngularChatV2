import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
import { userInfoDTO } from '../DTOs/userInfoDTO';

@Injectable({
  providedIn: 'root'
})
export class SignalRChatService {


  constructor() {
    this.buildConection();
  }
  private connection!:signalR.HubConnection
  baseUrl = environment.baseUrl;

  get isConnected():boolean{
    return this.connection.state == signalR.HubConnectionState.Connected
  }

  start() :Promise<void>{
      return this.connection.start();
  }

  private _$onUserJoin:Subject<userInfoDTO> = new Subject<userInfoDTO>();
  public $onUserJoin:Observable<userInfoDTO> =this._$onUserJoin.asObservable();

  buildConection(){
   this.connection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.baseUrl}/chathub`)
    .build();

    this.connection.on('UserJoin',(userInfoDTO:userInfoDTO)=>{
        this._$onUserJoin.next(userInfoDTO);
    });

    this.connection.start();

  }
}
