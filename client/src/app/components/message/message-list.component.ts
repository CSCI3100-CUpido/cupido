import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Chat } from '../../models/message.model';
import { MockMessageService } from '../../services/mock-message.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  chats: Chat[] = [];
  isLoading = false;
  currentUserId = '';
  isLoggedIn = false;

  constructor(
    private messageService: MockMessageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // 检查用户是否已登录
    const currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = !!currentUser;

    if (this.isLoggedIn && currentUser) {
      this.currentUserId = currentUser.id;
      this.loadChats();
    }
  }

  loadChats(): void {
    this.isLoading = true;
    this.messageService.getChats().subscribe({
      next: (data) => {
        this.chats = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading chats', error);
        this.isLoading = false;
      }
    });
  }

  getOtherParticipantId(chat: Chat): string {
    return chat.participants.find(id => id !== this.currentUserId) || '';
  }

  getParticipantName(participantId: string): string {
    // 简单的用户ID到名称的映射
    if (participantId === '1') return 'Admin';
    if (participantId === '2') return 'User';
    return `User ${participantId}`;
  }

  hasUnreadMessages(chat: Chat): boolean {
    return chat.lastMessage ? 
      (chat.lastMessage.recipientId === this.currentUserId && !chat.lastMessage.isRead) : 
      false;
  }

  login(): void {
    this.router.navigate(['/login']);
  }
  
  getFormattedDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleString();
  }
}