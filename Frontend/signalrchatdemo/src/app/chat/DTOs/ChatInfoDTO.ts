import { userInfoDTO } from "./userInfoDTO";

export interface ChatInfoDTO {
  integrants: userInfoDTO[];
  name: string;
  chatMessages: ChatMessageDTO[];
  id:number;
  messagesCount:number;
}

export interface ChatMessageDTO{
  id: number;
  content: string;
  date: Date;
  userInfo: userInfoDTO;
  temporalId?:string;
}
