import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { userChatsDTO } from '../DTOs/userChatsDTO';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private httpClient:HttpClient) {

  }
  baseUrl = environment.baseUrl;

  getUserChats(){
    return this.httpClient.get<userChatsDTO>(`${this.baseUrl}api/chat/userchats`);
  }
}
