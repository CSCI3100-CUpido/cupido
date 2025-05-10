import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Confession, ConfessionComment } from '../models/confession.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MockConfessionService {
  
  // Mock confessions data
  private confessions: Confession[] = [
    {
      id: '1',
      userId: '1', // Admin user
      content: 'I saw a girl with glasses at the CUHK library yesterday. You were sitting by the window wearing a blue top. We made eye contact and you smiled. I was too shy to say hello. Hope to meet you again!',
      createdAt: new Date('2023-03-10'),
      isAnonymous: true,
      likesCount: 42,
      isLiked: false,
      commentsCount: 3
    },
    {
      id: '2',
      userId: '2', // Regular user
      content: 'Is anyone else finding the Computer Science courses particularly challenging this semester? Would love to form a study group, especially for Data Structures and Algorithm Analysis.',
      createdAt: new Date('2023-03-15'),
      isAnonymous: false,
      authorName: 'User',
      authorPhoto: 'assets/images/default-avatar.png',
      likesCount: 18,
      isLiked: false,
      commentsCount: 5
    },
    {
      id: '3',
      userId: '1', // Admin user
      content: 'Saw someone super cute at the student center today! You were wearing AirPods and a CUHK hoodie. If you see this message, please message me!',
      imageUrl: 'assets/images/student-center.jpg',
      createdAt: new Date('2023-03-20'),
      isAnonymous: true,
      likesCount: 56,
      isLiked: false,
      commentsCount: 7
    },
    {
      id: '4',
      userId: '3', // Jenny
      content: 'Does anyone know the most romantic spots on campus for a date? I want to take someone special to a nice place.',
      createdAt: new Date('2023-03-25'),
      isAnonymous: false,
      authorName: 'Jenny',
      authorPhoto: 'assets/images/user3-avatar.png',
      likesCount: 29,
      isLiked: false,
      commentsCount: 8
    },
    {
      id: '5',
      userId: '4', // Michael
      content: 'Anyone interested in hiking on Hong Kong Island this weekend? I\'m an exchange student looking to make new friends!',
      createdAt: new Date('2023-03-28'),
      isAnonymous: false,
      authorName: 'Michael',
      authorPhoto: 'assets/images/user4-avatar.png',
      likesCount: 31,
      isLiked: false,
      commentsCount: 6
    },
    {
      id: '6',
      userId: '6', // David
      content: 'I\'m looking for friends to join my study group for the Physics exam next month. We meet at the library every Tuesday and Thursday evening.',
      createdAt: new Date('2023-04-01'),
      isAnonymous: false,
      authorName: 'David',
      authorPhoto: 'assets/images/user6-avatar.png',
      likesCount: 15,
      isLiked: false,
      commentsCount: 4
    },
    {
      id: '7',
      userId: '5', // Sophie
      content: 'I lost my blue notebook with all my Biology notes near the science building yesterday. If anyone found it, please let me know. I really need it for the upcoming exam!',
      createdAt: new Date('2023-04-03'),
      isAnonymous: false,
      authorName: 'Sophie',
      authorPhoto: 'assets/images/user5-avatar.png',
      likesCount: 12,
      isLiked: false,
      commentsCount: 3
    }
  ];

  private comments: ConfessionComment[] = [
    // Comments for the first confession
    {
      id: '1',
      confessionId: '1',
      userId: '2', // Regular user
      content: 'So romantic! Hope you two meet again!',
      createdAt: new Date('2023-03-11'),
      isAnonymous: false,
      authorName: 'User',
      authorPhoto: 'assets/images/default-avatar.png'
    },
    {
      id: '2',
      confessionId: '1',
      userId: '3', // Jenny
      content: 'I might know the girl you\'re talking about! I can introduce you next time!',
      createdAt: new Date('2023-03-12'),
      isAnonymous: false,
      authorName: 'Jenny',
      authorPhoto: 'assets/images/user3-avatar.png'
    },
    {
      id: '3',
      confessionId: '1',
      userId: '5', // Sophie
      content: 'The library is such a great place to meet new people. Good luck!',
      createdAt: new Date('2023-03-13'),
      isAnonymous: true
    },
    
    // Comments for the second confession
    {
      id: '4',
      confessionId: '2',
      userId: '1', // Admin user
      content: 'I\'m in the CS department and could help with your study group!',
      createdAt: new Date('2023-03-16'),
      isAnonymous: false,
      authorName: 'Admin',
      authorPhoto: 'assets/images/admin-avatar.png'
    },
    {
      id: '5',
      confessionId: '2',
      userId: '4', // Michael
      content: 'I find it difficult too! Let\'s create a study group, my WeChat is: michael_hk',
      createdAt: new Date('2023-03-16'),
      isAnonymous: false,
      authorName: 'Michael',
      authorPhoto: 'assets/images/user4-avatar.png'
    },
    
    // Comments for David's confession
    {
      id: '20',
      confessionId: '6',
      userId: '2', // User
      content: 'I\'d like to join! I\'m struggling with quantum mechanics.',
      createdAt: new Date('2023-04-01'),
      isAnonymous: false,
      authorName: 'User',
      authorPhoto: 'assets/images/default-avatar.png'
    },
    {
      id: '21',
      confessionId: '6',
      userId: '3', // Jenny
      content: 'What chapters are you studying currently?',
      createdAt: new Date('2023-04-02'),
      isAnonymous: false,
      authorName: 'Jenny',
      authorPhoto: 'assets/images/user3-avatar.png'
    },
    {
      id: '22',
      confessionId: '6',
      userId: '5', // Sophie
      content: 'I\'m in another study group but we could combine forces for the final review!',
      createdAt: new Date('2023-04-02'),
      isAnonymous: false,
      authorName: 'Sophie',
      authorPhoto: 'assets/images/user5-avatar.png'
    }
  ];

  constructor(private authService: AuthService) {}

  getConfessions(): Observable<Confession[]> {
    // Get current user (can be null if not logged in)
    const currentUser = this.authService.getCurrentUser();
    
    // Always return confessions, but mark owner and liked status if user is logged in
    const confessionsWithUserData = this.confessions.map(confession => {
      // Basic confession data that everyone can see
      const confessionToReturn = { ...confession };

      // Add user-specific data if logged in
      if (currentUser) {
        // Mark if user owns this confession
        confessionToReturn.isOwner = confession.userId === currentUser.id;
        
        // This would typically be determined based on user's like history
        // For demo, let's say user has liked posts with even IDs if they're Admin, odd IDs otherwise
        if (currentUser.roles?.includes('Admin')) {
          confessionToReturn.isLiked = parseInt(confession.id) % 2 === 0;
        } else {
          confessionToReturn.isLiked = parseInt(confession.id) % 2 === 1;
        }
      }
      
      return confessionToReturn;
    });
    
    return of(confessionsWithUserData).pipe(delay(500));
  }

  getConfession(id: string): Observable<Confession> {
    const confession = this.confessions.find(c => c.id === id);
    
    if (!confession) {
      return throwError(() => new Error('Confession not found'));
    }
    
    const currentUser = this.authService.getCurrentUser();
    const confessionToReturn = { ...confession };
    
    if (currentUser) {
      confessionToReturn.isOwner = confession.userId === currentUser.id;
      
      // Same logic as in getConfessions for isLiked
      if (currentUser.roles?.includes('Admin')) {
        confessionToReturn.isLiked = parseInt(confession.id) % 2 === 0;
      } else {
        confessionToReturn.isLiked = parseInt(confession.id) % 2 === 1;
      }
    }
    
    return of(confessionToReturn).pipe(delay(300));
  }

  createConfession(confession: Partial<Confession>): Observable<Confession> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const newConfession: Confession = {
      id: (this.confessions.length + 1).toString(),
      userId: currentUser.id,
      content: confession.content || '',
      imageUrl: confession.imageUrl,
      createdAt: new Date(),
      isAnonymous: confession.isAnonymous || false,
      authorName: confession.isAnonymous ? undefined : currentUser.username,
      authorPhoto: confession.isAnonymous ? undefined : currentUser.photoUrl,
      likesCount: 0,
      isLiked: false,
      commentsCount: 0,
      isOwner: true
    };
    
    this.confessions.unshift(newConfession); // Add to the beginning of the array
    
    return of(newConfession).pipe(delay(500));
  }

  updateConfession(id: string, confession: Partial<Confession>): Observable<Confession> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const index = this.confessions.findIndex(c => c.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Confession not found'));
    }
    
    const existingConfession = this.confessions[index];
    
    if (existingConfession.userId !== currentUser.id) {
      return throwError(() => new Error('Not authorized to update this confession'));
    }
    
    const updatedConfession: Confession = {
      ...existingConfession,
      content: confession.content || existingConfession.content,
      isAnonymous: confession.isAnonymous !== undefined ? confession.isAnonymous : existingConfession.isAnonymous,
      authorName: confession.isAnonymous ? undefined : currentUser.username,
      authorPhoto: confession.isAnonymous ? undefined : currentUser.photoUrl,
    };
    
    this.confessions[index] = updatedConfession;
    
    return of(updatedConfession).pipe(delay(500));
  }

  deleteConfession(id: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const index = this.confessions.findIndex(c => c.id === id);
    
    if (index === -1) {
      return throwError(() => new Error('Confession not found'));
    }
    
    const confession = this.confessions[index];
    
    // Only allow users to delete their own confessions or admins to delete any confession
    if (confession.userId !== currentUser.id && !currentUser.roles?.includes('Admin')) {
      return throwError(() => new Error('Not authorized to delete this confession'));
    }
    
    this.confessions.splice(index, 1);
    
    // Also delete all comments for this confession
    this.comments = this.comments.filter(c => c.confessionId !== id);
    
    return of(undefined).pipe(delay(500));
  }

  likeConfession(id: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const confession = this.confessions.find(c => c.id === id);
    
    if (!confession) {
      return throwError(() => new Error('Confession not found'));
    }
    
    // In a real app, we'd check if user already liked it
    // For now, just increase the count and mark as liked
    confession.likesCount++;
    confession.isLiked = true;
    
    return of(undefined).pipe(delay(300));
  }

  unlikeConfession(id: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const confession = this.confessions.find(c => c.id === id);
    
    if (!confession) {
      return throwError(() => new Error('Confession not found'));
    }
    
    // In a real app, we'd check if user already liked it
    // For now, just decrease the count and mark as unliked
    confession.likesCount = Math.max(0, confession.likesCount - 1); // Ensure it doesn't go below 0
    confession.isLiked = false;
    
    return of(undefined).pipe(delay(300));
  }

  getComments(confessionId: string): Observable<ConfessionComment[]> {
    const currentUser = this.authService.getCurrentUser();
    const confessionComments = this.comments
      .filter(comment => comment.confessionId === confessionId)
      .map(comment => ({
        ...comment,
        isOwner: currentUser ? comment.userId === currentUser.id : false
      }));
    
    return of(confessionComments).pipe(delay(300));
  }

  addComment(confessionId: string, content: string, isAnonymous: boolean): Observable<ConfessionComment> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const confession = this.confessions.find(c => c.id === confessionId);
    
    if (!confession) {
      return throwError(() => new Error('Confession not found'));
    }
    
    const newComment: ConfessionComment = {
      id: (this.comments.length + 1).toString(),
      confessionId: confessionId,
      userId: currentUser.id,
      content: content,
      createdAt: new Date(),
      isAnonymous: isAnonymous,
      authorName: isAnonymous ? undefined : currentUser.username,
      authorPhoto: isAnonymous ? undefined : currentUser.photoUrl,
      isOwner: true
    };
    
    this.comments.push(newComment);
    
    // Update comment count
    confession.commentsCount++;
    
    return of(newComment).pipe(delay(500));
  }

  deleteComment(confessionId: string, commentId: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const commentIndex = this.comments.findIndex(c => c.id === commentId);
    
    if (commentIndex === -1) {
      return throwError(() => new Error('Comment not found'));
    }
    
    const comment = this.comments[commentIndex];
    
    // Only allow users to delete their own comments or admins to delete any comment
    if (comment.userId !== currentUser.id && !currentUser.roles?.includes('Admin')) {
      return throwError(() => new Error('Not authorized to delete this comment'));
    }
    
    this.comments.splice(commentIndex, 1);
    
    // Update comment count
    const confession = this.confessions.find(c => c.id === confessionId);
    if (confession) {
      confession.commentsCount--;
    }
    
    return of(undefined).pipe(delay(500));
  }

  sendPrivateMessage(confessionId: string): Observable<{ chatId: string }> {
    const currentUser = this.authService.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not authenticated'));
    }
    
    const confession = this.confessions.find(c => c.id === confessionId);
    
    if (!confession) {
      return throwError(() => new Error('Confession not found'));
    }
    
    // Can't send a message to yourself
    if (confession.userId === currentUser.id) {
      return throwError(() => new Error('Cannot send a message to yourself'));
    }
    
    // Return chat ID 1 for demonstration
    return of({ chatId: '1' }).pipe(delay(500));
  }
}