import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { ChatInfoDTO, ChatMessageDTO } from '../DTOs/ChatInfoDTO';
import { userInfoDTO } from '../DTOs/userInfoDTO';

@Injectable({
  providedIn: 'root'
})
export class SignalRChatService {


  constructor(private authService: AuthService) {

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

  private _$onChatInfo:Subject<ChatInfoDTO> = new Subject<ChatInfoDTO>();
  public $onChatInfo:Observable<ChatInfoDTO> = this._$onChatInfo.asObservable();

  private _$onNewMessageReceived:Subject<ChatMessageDTO> = new Subject<ChatMessageDTO>();
  public $onNewMessageREceived:Observable<ChatMessageDTO> = this._$onNewMessageReceived.asObservable();

  private _$onUserLeave:Subject<userInfoDTO> = new Subject<userInfoDTO>();
  public $onUserLeave:Observable<userInfoDTO> = this._$onUserLeave.asObservable();

  /**
   * JoinRoom
   */
  public JoinRoom( roomName: string) {
    this.connection.send('joinRoom', roomName).then(c =>
      console.log(c)
      )
  }
  buildConection(){
   this.connection = new signalR.HubConnectionBuilder()

    .withUrl(`${this.baseUrl}chathub?access_token=${this.authService.token}`)
    .build();

    this.connection.on('UserJoin',(userInfoDTO:userInfoDTO)=>{
        this._$onUserJoin.next(userInfoDTO);
    });

    this.connection.on('ChatInfo', (ChatInfoDTo:ChatInfoDTO)=> {
      this._$onChatInfo.next(ChatInfoDTo);
    });


    this.connection.on('NewMessageReceived', (ChatMessageDTO: ChatMessageDTO)=> {
      this._$onNewMessageReceived.next(ChatMessageDTO);
    });
    this.connection.on('UserLeave', (userInfoDTO:userInfoDTO)=> {
      this._$onUserLeave.next(userInfoDTO);
    });

  }
}
