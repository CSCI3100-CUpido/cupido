export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    recipientId: string;
    content: string;
    createdAt: Date;
    isRead: boolean;
  }
  
  export interface Chat {
    id: string;
    participants: string[];
    lastMessage?: Message;
    createdAt: Date;
    updatedAt: Date;
  }