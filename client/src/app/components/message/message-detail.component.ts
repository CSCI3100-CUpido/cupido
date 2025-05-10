import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, Chat } from '../../models/message.model';
import { MockMessageService } from '../../services/mock-message.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-message-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './message-detail.component.html',
  styleUrls: ['./message-detail.component.css'],
  providers: [DatePipe] // 添加 DatePipe 为提供者
})
export class MessageDetailComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  chatId: string = '';
  chat: Chat | null = null;
  messages: Message[] = [];
  messageForm!: FormGroup;
  isLoading = false;
  isSending = false;
  currentUserId = '';
  otherUserName = '';
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private messageService: MockMessageService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe // 注入 DatePipe
  ) {}

  ngOnInit(): void {
    // 检查用户是否已登录
    const currentUser = this.authService.getCurrentUser();
    this.isLoggedIn = !!currentUser;

    if (this.isLoggedIn && currentUser) {
      this.currentUserId = currentUser.id;
      this.initForm();
      
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.chatId = id;
          this.loadChat();
        }
      });
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      if (this.messageContainer) {
        this.messageContainer.nativeElement.scrollTop = 
          this.messageContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  initForm(): void {
    this.messageForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  loadChat(): void {
    this.isLoading = true;
    
    this.messageService.getChat(this.chatId).subscribe({
      next: (chat) => {
        this.chat = chat;
        const otherParticipantId = this.getOtherParticipantId();
        this.otherUserName = this.getParticipantName(otherParticipantId);
        this.loadMessages();
      },
      error: (error) => {
        console.error('Error loading chat', error);
        this.isLoading = false;
        this.router.navigate(['/messages']);
      }
    });
  }

  loadMessages(): void {
    this.messageService.getMessages(this.chatId).subscribe({
      next: (messages) => {
        this.messages = messages;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading messages', error);
        this.isLoading = false;
      }
    });
  }

  sendMessage(): void {
    if (this.messageForm.invalid) {
      return;
    }

    const content = this.messageForm.value.content;
    this.isSending = true;

    this.messageService.sendMessage(this.chatId, content).subscribe({
      next: (message) => {
        this.messages.push(message);
        this.messageForm.reset();
        this.isSending = false;
      },
      error: (error) => {
        console.error('Error sending message', error);
        this.isSending = false;
      }
    });
  }

  getOtherParticipantId(): string {
    if (!this.chat) return '';
    return this.chat.participants.find(id => id !== this.currentUserId) || '';
  }

  getParticipantName(participantId: string): string {
    // 简单的用户ID到名称的映射
    if (participantId === '1') return 'Admin';
    if (participantId === '2') return 'User';
    return `User ${participantId}`;
  }

  isOwnMessage(message: Message): boolean {
    return message.senderId === this.currentUserId;
  }

  getMessageTime(message: Message): string {
    const today = new Date();
    const messageDate = new Date(message.createdAt);
    
    if (today.toDateString() === messageDate.toDateString()) {
      // Today, show time only
      return this.datePipe.transform(messageDate, 'shortTime') || '';
    } else {
      // Not today, show date and time
      return this.datePipe.transform(messageDate, 'short') || '';
    }
  }

  login(): void {
    this.router.navigate(['/login']);
  }
  
  navigateToMessages(): void {
    this.router.navigate(['/messages']);
  }
}