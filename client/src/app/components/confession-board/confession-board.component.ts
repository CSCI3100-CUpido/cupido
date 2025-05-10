import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Confession, ConfessionComment } from '../../models/confession.model';
import { ConfessionService } from '../../services/confession.service';

@Component({
  selector: 'app-confession-board',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    DatePipe,
    HttpClientModule
  ],
  templateUrl: './confession-board.component.html',
  styleUrls: ['./confession-board.component.css']
})
export class ConfessionBoardComponent implements OnInit {
  confessions: (Confession & { showComments?: boolean, comments?: ConfessionComment[] })[] = [];
  confessionForm!: FormGroup;
  commentForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  isSubmittingComment = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  currentFilter: 'latest' | 'popular' = 'latest';

  constructor(
    private confessionService: ConfessionService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
    this.loadConfessions();
  }

  initForms(): void {
    this.confessionForm = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(500)]],
      isAnonymous: [true]
    });

    this.commentForm = this.formBuilder.group({
      commentContent: ['', [Validators.required, Validators.maxLength(200)]],
      commentAnonymous: [true]
    });
  }

  get content() {
    return this.confessionForm.get('content') as FormControl;
  }

  loadConfessions(): void {
    this.isLoading = true;
    this.confessionService.getConfessions().subscribe({
      next: (data) => {
        this.confessions = data.map(confession => ({
          ...confession,
          showComments: false,
          comments: []
        }));
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading confessions', error);
        this.isLoading = false;
      }
    });
  }

  filterConfessions(filter: 'latest' | 'popular'): void {
    this.currentFilter = filter;
    // In a real application, you would call the API with different parameters
    // For now, we'll just sort the existing data
    if (filter === 'latest') {
      this.confessions.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      this.confessions.sort((a, b) => b.likesCount - a.likesCount);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.imagePreview = null;
  }

  submitConfession(): void {
    if (this.confessionForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    const confession: Partial<Confession> = {
      content: this.confessionForm.value.content,
      isAnonymous: this.confessionForm.value.isAnonymous
    };

    // In a real application, you would upload the image and get a URL
    // For this example, we'll skip that part
    
    this.confessionService.createConfession(confession).subscribe({
      next: (newConfession) => {
        this.confessionForm.reset({ isAnonymous: true });
        this.removeImage();
        
        // Add the new confession to the top of the list
        this.confessions.unshift({
          ...newConfession,
          showComments: false,
          comments: []
        });
        
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error creating confession', error);
        this.isSubmitting = false;
      }
    });
  }

  toggleLike(confession: Confession & { showComments?: boolean }): void {
    if (confession.isLiked) {
      this.confessionService.unlikeConfession(confession.id).subscribe({
        next: () => {
          confession.isLiked = false;
          confession.likesCount--;
        },
        error: (error) => {
          console.error('Error unliking confession', error);
        }
      });
    } else {
      this.confessionService.likeConfession(confession.id).subscribe({
        next: () => {
          confession.isLiked = true;
          confession.likesCount++;
        },
        error: (error) => {
          console.error('Error liking confession', error);
        }
      });
    }
  }

  toggleComments(confession: Confession & { showComments?: boolean; comments?: ConfessionComment[] }): void {
    confession.showComments = !confession.showComments;
    
    if (confession.showComments && (!confession.comments || confession.comments.length === 0)) {
      this.loadComments(confession);
    }
  }

  loadComments(confession: Confession & { comments?: ConfessionComment[] }): void {
    this.confessionService.getComments(confession.id).subscribe({
      next: (comments) => {
        confession.comments = comments;
      },
      error: (error) => {
        console.error('Error loading comments', error);
      }
    });
  }

  addComment(confession: Confession & { comments?: ConfessionComment[] }): void {
    if (this.commentForm.invalid) {
      return;
    }

    this.isSubmittingComment = true;
    const content = this.commentForm.value.commentContent;
    const isAnonymous = this.commentForm.value.commentAnonymous;

    this.confessionService.addComment(confession.id, content, isAnonymous).subscribe({
      next: (newComment) => {
        if (confession.comments) {
          confession.comments.push(newComment);
        } else {
          confession.comments = [newComment];
        }
        confession.commentsCount = (confession.commentsCount || 0) + 1;
        
        this.commentForm.reset({ commentAnonymous: true });
        this.isSubmittingComment = false;
      },
      error: (error) => {
        console.error('Error adding comment', error);
        this.isSubmittingComment = false;
      }
    });
  }

  sendPrivateMessage(confession: Confession): void {
    this.confessionService.sendPrivateMessage(confession.id).subscribe({
      next: (response) => {
        // Navigate to the chat with the new chat ID
        this.router.navigate(['/messages', response.chatId]);
      },
      error: (error) => {
        console.error('Error sending private message', error);
      }
    });
  }
}