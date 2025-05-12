// src/app/services/mock-message.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Message, Chat } from '../models/message.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockMessageService {
  private chats: Chat[] = [];
  private messages: Message[] = [];
  
  constructor(private authService: AuthService) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Initialize mock chats and messages

    // Chat 1: Admin (1) and User (2)
    this.addChat('1', ['1', '2'], [
      { senderId: '1', content: 'Hello! Welcome to Cupido! How are you finding the app so far?', timestamp: '2023-03-15T10:00:00', isRead: true },
      { senderId: '2', content: 'Thanks! The app looks great! I love how easy it is to use.', timestamp: '2023-03-15T10:05:00', isRead: true },
      { senderId: '1', content: 'Is there anything specific you would like to know about the app features?', timestamp: '2023-03-15T10:10:00', isRead: true },
      { senderId: '2', content: 'I\'m curious about the matching algorithm. How does it work with university students?', timestamp: '2023-03-20T15:30:00', isRead: false }
    ]);

    // Chat 2: David (6) and Sophie (5) - A mutual match
    this.addChat('2', ['6', '5'], [
      { senderId: '6', content: 'Hi Sophie! I noticed we matched and we both have an interest in photography.', timestamp: '2023-03-16T14:20:00', isRead: true },
      { senderId: '5', content: 'Hey David! Yes, I love taking photos especially while hiking. What kind of photography do you enjoy?', timestamp: '2023-03-16T14:45:00', isRead: true },
      { senderId: '6', content: 'I\'m into astrophotography! I have a small telescope and camera setup to capture night sky images.', timestamp: '2023-03-16T15:10:00', isRead: true },
      { senderId: '5', content: 'That sounds amazing! I\'ve always wanted to try astrophotography. Would you be interested in showing me sometime?', timestamp: '2023-03-16T15:30:00', isRead: true },
      { senderId: '6', content: 'I would love to! There\'s a great spot near CUHK with less light pollution. Maybe we could go this weekend?', timestamp: '2023-03-16T16:00:00', isRead: false }
    ]);

    // Chat 3: Michael (4) and User (2) - Another mutual match
    this.addChat('3', ['4', '2'], [
      { senderId: '4', content: 'Hi there! I saw we matched and you like sports too. Do you play any specific sports?', timestamp: '2023-03-17T09:15:00', isRead: true },
      { senderId: '2', content: 'Hi Michael! Yes, I play basketball and swim occasionally. How about you?', timestamp: '2023-03-17T09:45:00', isRead: true },
      { senderId: '4', content: 'No way! Those are exactly the sports I mentioned in my profile! I play basketball with a group on campus every Thursday evening.', timestamp: '2023-03-17T10:00:00', isRead: true },
      { senderId: '2', content: 'That\'s awesome! I\'d love to join sometime if that\'s okay?', timestamp: '2023-03-17T10:15:00', isRead: true },
      { senderId: '4', content: 'Absolutely! We meet at the main gym at 7pm. Would you want to come this Thursday?', timestamp: '2023-03-17T10:30:00', isRead: true },
      { senderId: '2', content: 'Sounds perfect! I\'ll bring my gear. Looking forward to it!', timestamp: '2023-03-17T11:00:00', isRead: false }
    ]);

    // Chat 4: Jenny (3) and David (6) - One-sided like (Jenny likes David)
    this.addChat('4', ['3', '6'], [
      { senderId: '3', content: 'Hi David! I noticed your profile and saw you\'re interested in music. I love music too!', timestamp: '2023-03-18T16:40:00', isRead: true },
      { senderId: '6', content: 'Hi Jenny! Yes, I play guitar and write songs. What kind of music do you like?', timestamp: '2023-03-18T17:30:00', isRead: true },
      { senderId: '3', content: 'I enjoy all kinds of music, but particularly indie and folk. Do you perform anywhere on campus?', timestamp: '2023-03-18T17:45:00', isRead: true },
      { senderId: '6', content: 'I sometimes play at the student center open mic nights. The next one is in two weeks if you want to check it out.', timestamp: '2023-03-18T18:10:00', isRead: true },
      { senderId: '3', content: 'That sounds great! I\'ll definitely try to make it. Would you be interested in grabbing coffee sometime before that?', timestamp: '2023-03-18T18:30:00', isRead: false }
    ]);

    // Chat 5: Alex (8) and Lily (7) - A mutual match
    this.addChat('5', ['8', '7'], [
      { senderId: '8', content: 'Hey Lily! I saw you\'re into photography. I\'ve been looking for someone to help me with my Instagram page layout.', timestamp: '2023-03-19T10:20:00', isRead: true },
      { senderId: '7', content: 'Hi Alex! I love helping with that kind of thing. What kind of aesthetic are you going for?', timestamp: '2023-03-19T10:40:00', isRead: true },
      { senderId: '8', content: 'I\'m trying to showcase my gaming and tech stuff but make it look cohesive. Do you have any suggestions?', timestamp: '2023-03-19T11:00:00', isRead: true },
      { senderId: '7', content: 'Definitely! I think a consistent color scheme would work well - maybe blues and purples with black backgrounds?', timestamp: '2023-03-19T11:15:00', isRead: true },
      { senderId: '8', content: 'That sounds perfect! Would you want to meet up at the campus coffee shop to talk more about it?', timestamp: '2023-03-19T11:30:00', isRead: false }
    ]);

    // Chat 6: William (12) and Rachel (9) - A mutual match
    this.addChat('6', ['12', '9'], [
      { senderId: '12', content: 'Hi Rachel! I noticed we matched and you\'re interested in hiking and photography like me.', timestamp: '2023-03-20T14:15:00', isRead: true },
      { senderId: '9', content: 'Hey William! Yes, I love combining those hobbies. Have you explored any good hiking trails in Hong Kong?', timestamp: '2023-03-20T14:30:00', isRead: true },
      { senderId: '12', content: 'I recently hiked the Dragon\'s Back trail and got some amazing aerial shots with my drone. Have you been there?', timestamp: '2023-03-20T14:45:00', isRead: true },
      { senderId: '9', content: 'I haven\'t been to Dragon\'s Back yet, but it\'s definitely on my list! I\'d love to see your photos sometime.', timestamp: '2023-03-20T15:00:00', isRead: true },
      { senderId: '12', content: 'I\'d be happy to show you! Maybe we could even hike there together if you\'re interested?', timestamp: '2023-03-20T15:15:00', isRead: false }
    ]);

    // Chat 7: Daniel (10) and Olivia (11) - One-sided like (Daniel likes Olivia)
    this.addChat('7', ['10', '11'], [
      { senderId: '10', content: 'Hi Olivia! I saw from your profile that you\'re into marketing and social media. I\'m studying economics and find that area fascinating.', timestamp: '2023-03-21T09:30:00', isRead: true },
      { senderId: '11', content: 'Hey Daniel! Yes, I\'m focusing on digital marketing strategies. There\'s a lot of overlap with economics principles.', timestamp: '2023-03-21T10:00:00', isRead: true },
      { senderId: '10', content: 'Definitely! I\'m actually working on a project about social media ROI in different markets. Would you be interested in chatting about it?', timestamp: '2023-03-21T10:15:00', isRead: true },
      { senderId: '11', content: 'That sounds interesting! I have some insights from my internship last summer that might be helpful.', timestamp: '2023-03-21T10:30:00', isRead: true },
      { senderId: '10', content: 'Perfect! Would you want to meet at the business school cafe tomorrow around 3pm?', timestamp: '2023-03-21T10:45:00', isRead: false }
    ]);
  }

  // Helper function to add a chat with messages
  private addChat(chatId: string, participants: string[], messageData: { senderId: string, content: string, timestamp: string, isRead: boolean }[]): void {
    // Create chat
    const chat: Chat = {
      id: chatId,
      participants: participants,
      createdAt: new Date(messageData[0].timestamp),
      updatedAt: new Date(messageData[messageData.length - 1].timestamp)
    };

    // Create messages
    const chatMessages: Message[] = messageData.map((data, index) => {
      const message: Message = {
        id: `${chatId}_${index + 1}`,
        chatId: chatId,
        senderId: data.senderId,
        recipientId: participants.find(id => id !== data.senderId) || '',
        content: data.content,
        createdAt: new Date(data.timestamp),
        isRead: data.isRead
      };
      this.messages.push(message);
      return message;
    });

    // Set last message
    chat.lastMessage = chatMessages[chatMessages.length - 1];
    
    // Add chat to chats array
    this.chats.push(chat);
  }

  getChats(): Observable<Chat[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Filter chats where the current user is a participant
    const userChats = this.chats.filter(chat => 
      chat.participants.includes(currentUser.id)
    );
    
    return of(userChats).pipe(delay(300));
  }

  getChat(chatId: string): Observable<Chat> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const chat = this.chats.find(c => c.id === chatId);
    
    if (!chat) {
      return throwError(() => new Error('Chat not found'));
    }

    if (!chat.participants.includes(currentUser.id)) {
      return throwError(() => new Error('Unauthorized access to chat'));
    }
    
    return of(chat).pipe(delay(300));
  }

  getMessages(chatId: string): Observable<Message[]> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const chat = this.chats.find(c => c.id === chatId);
    
    if (!chat) {
      return throwError(() => new Error('Chat not found'));
    }

    if (!chat.participants.includes(currentUser.id)) {
      return throwError(() => new Error('Unauthorized access to chat'));
    }

    const chatMessages = this.messages.filter(m => m.chatId === chatId);
    
    // Mark messages as read if current user is the recipient
    chatMessages.forEach(message => {
      if (message.recipientId === currentUser.id && !message.isRead) {
        message.isRead = true;
      }
    });
    
    return of(chatMessages).pipe(delay(300));
  }

  sendMessage(chatId: string, content: string): Observable<Message> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const chat = this.chats.find(c => c.id === chatId);
    
    if (!chat) {
      return throwError(() => new Error('Chat not found'));
    }

    if (!chat.participants.includes(currentUser.id)) {
      return throwError(() => new Error('Unauthorized access to chat'));
    }

    // Find the recipient (the other participant)
    const recipientId = chat.participants.find(id => id !== currentUser.id) || '';

    // Create a new message
    const newMessage: Message = {
      id: `${chatId}_${this.messages.filter(m => m.chatId === chatId).length + 1}`,
      chatId: chatId,
      senderId: currentUser.id,
      recipientId: recipientId,
      content: content,
      createdAt: new Date(),
      isRead: false
    };

    // Add to messages array
    this.messages.push(newMessage);

    // Update the chat's last message and updatedAt
    chat.lastMessage = newMessage;
    chat.updatedAt = new Date();
    
    return of(newMessage).pipe(delay(300));
  }

  markAsRead(messageId: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    const message = this.messages.find(m => m.id === messageId);
    
    if (!message) {
      return throwError(() => new Error('Message not found'));
    }

    if (message.recipientId !== currentUser.id) {
      return throwError(() => new Error('Unauthorized access to message'));
    }

    message.isRead = true;
    
    return of(undefined).pipe(delay(300));
  }

  createChat(recipientId: string): Observable<Chat> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated'));
    }

    // Check if chat already exists
    const existingChat = this.chats.find(chat => 
      chat.participants.includes(currentUser.id) && 
      chat.participants.includes(recipientId)
    );

    if (existingChat) {
      return of(existingChat).pipe(delay(300));
    }

    // Create a new chat
    const newChat: Chat = {
      id: (this.chats.length + 1).toString(),
      participants: [currentUser.id, recipientId],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add to chats array
    this.chats.push(newChat);
    
    return of(newChat).pipe(delay(300));
  }
}