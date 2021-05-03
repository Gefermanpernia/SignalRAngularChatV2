import { AfterViewChecked, AfterViewInit, Component,  ElementRef,  OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ChatInfoDTO } from '../DTOs/ChatInfoDTO';
import { SignalRChatService } from '../services/signal-rchat.service';
import { AuthService } from '../../auth/services/auth.service';
import { generateTemporalChatId } from '../../shared/utils/generalUtils';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss'],
  providers:[
    SignalRChatService
  ]
})
export class ChatRoomComponent implements OnInit, OnDestroy, AfterViewChecked {

  constructor(private signalRChatService:SignalRChatService,
    private activatedRoute: ActivatedRoute,
    private authService:AuthService) {
    this.CreateSuscritionSignalR();
    this.checkSignalRConnection();
  }
  ngAfterViewChecked(): void {

   if(this.needScrollDown)
   {
    this.scrollDown();
    this.needScrollDown =false;
   }

  }


  needScrollDown:boolean=false;

  scrollSize:number = 0;

  private scrollDown(){

   this.messagesContainer.nativeElement.scrollTop =
    this.messagesContainer.nativeElement.scrollHeight;
    console.log("Scrolling down");
  }

  @ViewChild('messages')
  messagesContainer!:ElementRef;

  private checkSignalRConnection(){
    if(!this.signalRChatService.isConnected){
      this.signalRChatService.start()
      .finally(()=>{

        this.signalRIsConnected=this.signalRChatService.isConnected;
        console.log(this.signalRIsConnected);
        if(this.signalRIsConnected){
        let chatRoom = this.activatedRoute.snapshot.params.chatName;
        this.signalRChatService.JoinRoom(chatRoom).then(
          ()=> {
            console.log("Join!!!");
          }
        )
        }
      })
    }

  }
  ChatInfo: ChatInfoDTO= {
    chatMessages: [],
    integrants: [],
    name: "",
    messagesCount:0,
    id:-1
  };


  chatinputText:string="";
  private CreateSuscritionSignalR() {

    this.$onChatInfoSuscription = this.signalRChatService.$onChatInfo.subscribe(c => {

      this.ChatInfo = c;
      this.needScrollDown=true;
    });

    this.$onUserJoinSuscription = this.signalRChatService.$onUserJoin.subscribe(userInfo => {
      if(this.ChatInfo){
        this.ChatInfo.integrants.push(userInfo);
      }
    })

    this.$onNewMessageSuscription = this.signalRChatService.$onNewMessageREceived.subscribe(messsage => {
      this.ChatInfo.chatMessages.push(messsage)
      this.ChatInfo.messagesCount++;
      this.needScrollDown=true;
    })

    this.$onUserLeaveSuscription=  this.signalRChatService.$onUserLeave.subscribe(userLeave => {
      this.ChatInfo.integrants = this.ChatInfo.integrants.filter(c => c.userId != userLeave.userId)
    })

    this.$onOldMessagesLoadSuscription = this.signalRChatService.$onOldMessagesLoad.subscribe(messages =>
      {
        this.ChatInfo.chatMessages = messages.concat(this.ChatInfo.chatMessages);
      })

      this.$onMessageConfirmationSuscription = this.signalRChatService.$onMessageConfirmation.subscribe(msg =>{
        let uMsg = this.ChatInfo.chatMessages.find(m => m.temporalId ==msg.temporalId );

        if(uMsg){
          uMsg.id = msg.messageId;
        }
      } );

  }

  signalRIsConnected:boolean = false;

  $onUserLeaveSuscription!:Subscription;
  $onChatInfoSuscription!:Subscription;
  $onNewMessageSuscription!:Subscription;
  $onUserJoinSuscription!:Subscription;
  $onMessageConfirmationSuscription!:Subscription;
  $onOldMessagesLoadSuscription!:Subscription;

  ngOnInit(): void {
    this.$onUserLeaveSuscription = this.signalRChatService.$onUserJoin.subscribe(r => {
    })
  }

  getMyInfo(){
    return this.ChatInfo.integrants.find(u=> u.userId == this.authService.claimsInfo.userId)
  }

  sendMessage(){
    if(!this.chatinputText){
      return;
    }

    const temporalId = generateTemporalChatId(15);


    this.signalRChatService.sendMessage(
      {content: this.chatinputText,
      roomName: this.ChatInfo.name,
      temporalId
    });

    let userInfo = this.getMyInfo();

    this.ChatInfo.chatMessages.push({
      content:this.chatinputText,
      date: new Date(),
      userInfo: {
        userId:userInfo?.userId ? userInfo.userId : '',
        userName: userInfo?.userName ? userInfo.userName : 'Yo'
      },
      id: -1,
      temporalId
    });
      this.chatinputText="";
     this.needScrollDown=true;

  }
  ngOnDestroy(): void {
    this.$onUserLeaveSuscription?.unsubscribe();
    this.$onUserJoinSuscription?.unsubscribe();
    this.$onNewMessageSuscription?.unsubscribe();
    this.$onChatInfoSuscription?.unsubscribe();
    this.$onMessageConfirmationSuscription?.unsubscribe();
    this.$onOldMessagesLoadSuscription?.unsubscribe();
  }

  keyPressOnInput(event:KeyboardEvent){

    if(event.key == "Enter"){
      this.sendMessage();
    }
  }

  messagesScroll(event:any){
      let elementRef = event.target;
      if(elementRef.scrollTop<50){
        this.loadNextMessages();
      }
  }

  loadingPastMessages:boolean = false;
  loadNextMessages(){

    const skipCount = this.ChatInfo.chatMessages.length;

    if(skipCount >= this.ChatInfo.messagesCount || this.loadingPastMessages){
      return;
    }

    this.loadingPastMessages = true;

    this.signalRChatService
    .loadOldMessages(this.ChatInfo.id,skipCount)
    .then(()=> {
      this.loadingPastMessages = false;

    });

  }
}
