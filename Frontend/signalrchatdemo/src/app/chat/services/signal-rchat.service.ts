import {  Injectable, OnDestroy } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { environment } from '../../../environments/environment.prod';
import { ChatInfoDTO, ChatMessageDTO } from '../DTOs/ChatInfoDTO';
import { SendMessageDTO } from '../DTOs/SendMessageDTO';
import { userInfoDTO } from '../DTOs/userInfoDTO';
import { messageConfirmationDTO } from '../DTOs/messageConfirmationDTO';

@Injectable({
  providedIn: 'root'
})
export class SignalRChatService implements OnDestroy {


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

  private _$onOldMessagesLoad:Subject<ChatMessageDTO[]> = new Subject<ChatMessageDTO[]>();
  public $onOldMessagesLoad:Observable<ChatMessageDTO[]> = this._$onOldMessagesLoad.asObservable();

  public _$onMessageConfirmation:Subject<messageConfirmationDTO> = new Subject<messageConfirmationDTO>();
  public $onMessageConfirmation:Observable<messageConfirmationDTO> = this._$onMessageConfirmation.asObservable();

  /**
   * JoinRoom
   */
  public JoinRoom( roomName: string) {
    return this.connection.send('joinRoom', roomName);
  }


  public loadOldMessages(chatId:number,currentMessagesCount:number){

      return this.connection.send('LoadPastMessages',chatId,currentMessagesCount);

  }

  public sendMessage(sendmessage: SendMessageDTO) {

    return this.connection.send('sendMessage', sendmessage);
  }

  buildConection(){
   this.connection = new signalR.HubConnectionBuilder()
    .withUrl(`${this.baseUrl}chathub?access_token=${this.authService.token}`)
    .withAutomaticReconnect()
    .build();

    this.connection.on('UserJoin',(userInfoDTO:userInfoDTO)=>{
        this._$onUserJoin.next(userInfoDTO);
    });

    this.connection.on('ChatInfo', (ChatInfoDTo:ChatInfoDTO)=> {
      console.log("Chat info received");
      this._$onChatInfo.next(ChatInfoDTo);
    });


    this.connection.on('NewMessageReceived', (ChatMessageDTO: ChatMessageDTO)=> {
      this._$onNewMessageReceived.next(ChatMessageDTO);
    });
    this.connection.on('UserLeave', (userInfoDTO:userInfoDTO)=> {
      this._$onUserLeave.next(userInfoDTO);
    });

    this.connection.on('pastMessagesLoad', (chatMessages:ChatMessageDTO[])=> {
      this._$onOldMessagesLoad.next(chatMessages);
    })

    this.connection.on('messageConfirmation',(messageConfirmation:messageConfirmationDTO) => {

      this._$onMessageConfirmation.next(messageConfirmation);
    });

  }


  ngOnDestroy(): void {
    this._$onChatInfo.complete();
    this._$onNewMessageReceived.complete();
    this._$onOldMessagesLoad.complete();
    this._$onUserLeave.complete();
    this._$onUserJoin.complete();
    this._$onMessageConfirmation.complete();

    this.connection.stop();
   }
}
