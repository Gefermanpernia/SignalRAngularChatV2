import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ChatlayoutComponent } from '../chatlayout/chatlayout.component';
import { ChoiceChatComponent } from '../choice-chat/choice-chat.component';
import { ChatRoomComponent } from '../chat-room/chat-room.component';
import { TokenGuardGuard } from '../../guards/token-guard.guard';

const routes: Routes =[
    {
      path:'',
      component:ChatlayoutComponent,
      children:
      [
        {
          path:'choicechat',
          component:ChoiceChatComponent
        },
        {
          path:'chatroom/:chatName',
          component:ChatRoomComponent
        },
        {
          path:'',
          pathMatch:'full',
          redirectTo:'/chat/choicechat'
        },
        {
          path:'**',
          pathMatch:'full',
          redirectTo:'/chat/choicechat'
        }
      ],
      canActivate:[TokenGuardGuard]

    }


]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports:[
    RouterModule
  ]
})
export class ChatRoutingModule { }
