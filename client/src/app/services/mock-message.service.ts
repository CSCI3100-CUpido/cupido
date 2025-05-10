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
    // Initialize mock chats and messages between admin and user
    const chatId = '1';
    this.chats.push({
      id: chatId,
      participants: ['1', '2'], // Admin and User IDs
      createdAt: new Date('2023-03-15'),
      updatedAt: new Date('2023-03-20')
    });

    // Add messages to the chat
    this.messages.push({
      id: '1',
      chatId: chatId,
      senderId: '1', // Admin
      recipientId: '2', // User
      content: 'Hello! Welcome to Cupido! How are you finding the app so far?',
      createdAt: new Date('2023-03-15T10:00:00'),
      isRead: true
    });

    this.messages.push({
      id: '2',
      chatId: chatId,
      senderId: '2', // User
      recipientId: '1', // Admin
      content: 'Thanks! The app looks great! I love how easy it is to use.',
      createdAt: new Date('2023-03-15T10:05:00'),
      isRead: true
    });

    this.messages.push({
      id: '3',
      chatId: chatId,
      senderId: '1', // Admin
      recipientId: '2', // User
      content: 'Is there anything specific you would like to know about the app features?',
      createdAt: new Date('2023-03-15T10:10:00'),
      isRead: true
    });

    this.messages.push({
      id: '4',
      chatId: chatId,
      senderId: '2', // User
      recipientId: '1', // Admin
      content: 'I\'m curious about the matching algorithm. How does it work with university students?',
      createdAt: new Date('2023-03-20T15:30:00'),
      isRead: false
    });

    // Update the last message in the chat
    this.chats[0].lastMessage = this.messages[this.messages.length - 1];
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
      id: (this.messages.length + 1).toString(),
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