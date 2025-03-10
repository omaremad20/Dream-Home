// chats.interface.ts

export interface User1 {
  _id: string;
  email: string;
}

export interface Message {
  sender: User1;
  receiver: User1;
  message: string;
  timestamp: string;
  _id: string;
}

export interface Chat {
  _id: string;
  messages: Message[];
  user1: User1;
  user2: User1;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface ChatsResponse {
  chats: Chat[];
}
