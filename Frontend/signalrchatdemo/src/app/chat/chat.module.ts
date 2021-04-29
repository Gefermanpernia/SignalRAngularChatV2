import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatRoutingModule } from './chat-routing/chat-routing.module';
import { ChatlayoutComponent } from './chatlayout/chatlayout.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChoiceChatComponent } from './choice-chat/choice-chat.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';



@NgModule({
  declarations: [
    ChatlayoutComponent,
    ChoiceChatComponent,
    ChatRoomComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ChatRoutingModule
  ]
})
export class ChatModule { }
