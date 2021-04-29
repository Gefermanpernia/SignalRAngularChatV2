import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SignalRChatService } from '../services/signal-rchat.service';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit, OnDestroy {

  constructor(private signalRChatService:SignalRChatService) {
    this.checkSignalRConnection();
  }

  private checkSignalRConnection(){
    if(!this.signalRChatService.isConnected){
      this.signalRChatService.start()
      .then(()=> {
        this.signalRIsConnected=true;
      })
    }

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
