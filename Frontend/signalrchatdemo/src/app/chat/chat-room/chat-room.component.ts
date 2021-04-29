import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatInfoDTO } from '../DTOs/ChatInfoDTO';
import { SignalRChatService } from '../services/signal-rchat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  constructor(private signalRChatService:SignalRChatService, private activatedRoute: ActivatedRoute) {
    this.CreateSuscritionSignalR();
    this.checkSignalRConnection();
  }

  private checkSignalRConnection(){
    if(!this.signalRChatService.isConnected){
      this.signalRChatService.start()
      .then(()=> {
        this.signalRIsConnected=true;
        let chatRoom = this.activatedRoute.snapshot.params.chatName;
        this.signalRChatService.JoinRoom(chatRoom)
      })
    }

  }
  ChatInfo: ChatInfoDTO= {
    chatMessages: [],
    integrants: [],
    name: "",
  };
  private CreateSuscritionSignalR() {

    this.signalRChatService.$onChatInfo.subscribe(c => {

      this.ChatInfo = c;
      console.log(this.ChatInfo);
    });

    this.signalRChatService.$onUserJoin.subscribe(userInfo => {
      if(this.ChatInfo){
        this.ChatInfo.integrants.push(userInfo);
      }
    })

    this.signalRChatService.$onNewMessageREceived.subscribe(messsage => {
      this.ChatInfo.chatMessages.push(messsage)
    })

    this.signalRChatService.$onUserLeave.subscribe(userLeave => {
      this.ChatInfo.integrants = this.ChatInfo.integrants.filter(c => c.userId != userLeave.userId)
    })
  }

  signalRIsConnected:boolean = false;
  $onUserLeaveSuscription!:Subscription;

  ngOnInit(): void {

    this.$onUserLeaveSuscription = this.signalRChatService.$onUserJoin.subscribe(r => {


    })



  }

  ngOnDestroy(): void {
    this.$onUserLeaveSuscription.unsubscribe();
  }


}
