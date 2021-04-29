import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/services/auth.service';
import { ChatService } from '../services/chat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-choice-chat',
  templateUrl: './choice-chat.component.html',
  styleUrls: ['./choice-chat.component.scss']
})
export class ChoiceChatComponent implements OnInit {

  constructor(private authService:AuthService,
    private chatService:ChatService,
    private router:Router) { }

    chatNames:string[] = [];
  ngOnInit(): void {

      this.chatService.getUserChats()
      .subscribe(resp => {
        this.chatNames = resp.chatNames;
      },err => console.log(err))


  }

  newChatName:string | undefined;

  gotoNewChat(){
    if(this.newChatName){

      this.router.navigate(['chat','chatroom',this.newChatName]);
    }
  }
}
