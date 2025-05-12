// src/app/components/match/match-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatchingService, MatchedUser } from '../../services/matching.service';
import { TimeagoPipe } from '../../pipes/timeago.pipe';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-match-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, TimeagoPipe],
  templateUrl: './match-dashboard.component.html',
  styleUrls: ['./match-dashboard.component.css']
})
export class MatchDashboardComponent implements OnInit {
  isLoggedIn = false;
  currentUser: any;
  potentialMatches: MatchedUser[] = [];
  mutualMatches: MatchedUser[] = [];
  likedUsers: MatchedUser[] = [];
  likedByUsers: MatchedUser[] = [];
  
  activeSection: 'discover' | 'matches' | 'liked' | 'likedBy' = 'discover';
  
  isLoading = false;
  errorMessage: string | null = null;
  
  // Current card for swipe functionality
  currentIndex = 0;
  noMoreMatches = false;
  swipeDirection: 'left' | 'right' | null = null;
  
  // Match notification
  showMatchModal = false;
  matchedUser: MatchedUser | null = null;
  
  // Interests for filtering
  allInterests = [
    'Sports', 'Movies', 'Music', 'Reading', 'Art', 'Gaming',
    'Cooking', 'Travel', 'Photography', 'Technology', 'Hiking',
    'Dancing', 'Writing', 'Fashion', 'Fitness', 'Programming',
    'Basketball', 'Swimming', 'Marketing', 'Social Media',
    'Literature', 'Arts', 'Languages', 'Biology', 'Physics',
    'Guitar', 'Astronomy', 'Environmental Protection'
  ];
  
  selectedInterests: string[] = [];

  constructor(
    private matchingService: MatchingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Check if user is logged in
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      
      if (this.isLoggedIn) {
        this.loadPotentialMatches();
        this.loadMutualMatches();
        this.loadLikedUsers();
        this.loadLikedByUsers();
        
        // Initialize selected interests based on user's interests
        if (user?.interests && Array.isArray(user.interests)) {
          this.selectedInterests = [...user.interests];
        }
      }
    });
  }
  
  // Load potential matches
  loadPotentialMatches(): void {
    this.isLoading = true;
    this.matchingService.getPotentialMatches().subscribe({
      next: (matches) => {
        this.potentialMatches = matches;
        this.isLoading = false;
        this.noMoreMatches = matches.length === 0;
        this.currentIndex = 0;
        this.swipeDirection = null;
      },
      error: (error) => {
        console.error('Error loading potential matches', error);
        this.errorMessage = 'Failed to load potential matches. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  // Load mutual matches
  loadMutualMatches(): void {
    this.matchingService.getMatches().subscribe({
      next: (matches) => {
        this.mutualMatches = matches;
      },
      error: (error) => {
        console.error('Error loading mutual matches', error);
      }
    });
  }
  
  // Load liked users
  loadLikedUsers(): void {
    this.matchingService.getLikedUsers().subscribe({
      next: (users) => {
        this.likedUsers = users;
      },
      error: (error) => {
        console.error('Error loading liked users', error);
      }
    });
  }
  
  // Load users who liked the current user
  loadLikedByUsers(): void {
    this.matchingService.getLikedByUsers().subscribe({
      next: (users) => {
        this.likedByUsers = users;
      },
      error: (error) => {
        console.error('Error loading liked by users', error);
      }
    });
  }
  
  // Filter potential matches by interests
  filterByInterests(): void {
    if (this.selectedInterests.length === 0) {
      this.loadPotentialMatches(); // Reset to all matches
      return;
    }
    
    // In a real app, this would call an API with the filter
    // For our mock, we'll filter the existing potentialMatches
    this.isLoading = true;
    
    setTimeout(() => {
      if (this.potentialMatches.length > 0) {
        const filteredMatches = this.potentialMatches.filter(match => {
          // Find matches that have at least one of the selected interests
          return match.interests.some(interest => 
            this.selectedInterests.includes(interest)
          );
        });
        
        // Sort by number of matching interests
        filteredMatches.sort((a, b) => {
          const aMatches = a.interests.filter(i => this.selectedInterests.includes(i)).length;
          const bMatches = b.interests.filter(i => this.selectedInterests.includes(i)).length;
          return bMatches - aMatches;
        });
        
        this.potentialMatches = filteredMatches;
        this.noMoreMatches = filteredMatches.length === 0;
        this.currentIndex = 0;
      }
      
      this.isLoading = false;
    }, 500);
  }
  
  // Toggle interest selection for filtering
  toggleInterestFilter(interest: string): void {
    const index = this.selectedInterests.indexOf(interest);
    if (index === -1) {
      this.selectedInterests.push(interest);
    } else {
      this.selectedInterests.splice(index, 1);
    }
    this.filterByInterests();
  }
  
  // Change active section
  changeSection(section: 'discover' | 'matches' | 'liked' | 'likedBy'): void {
    this.activeSection = section;
  }
  
  // Like a user
  likeUser(user: MatchedUser): void {
    if (this.swipeDirection) return; // Prevent multiple actions
    
    this.swipeDirection = 'right';
    
    setTimeout(() => {
      this.matchingService.likeUser(user.id).subscribe({
        next: (response) => {
          // Check if it's a match
          if (response.isMatch) {
            this.matchedUser = user;
            this.showMatchModal = true;
            this.loadMutualMatches();
          }
          
          // Add to liked users if not already there
          if (!this.likedUsers.some(u => u.id === user.id)) {
            this.likedUsers = [...this.likedUsers, user];
          }
          
          this.nextCard();
        },
        error: (error) => {
          console.error('Error liking user', error);
          this.nextCard();
        }
      });
    }, 500); // Wait for animation
  }
  
  // Pass (dislike) a user
  passUser(): void {
    if (this.swipeDirection) return; // Prevent multiple actions
    
    this.swipeDirection = 'left';
    
    setTimeout(() => {
      this.nextCard();
    }, 500); // Wait for animation
  }
  
  // Move to the next card
  nextCard(): void {
    this.currentIndex++;
    this.swipeDirection = null;
    
    // Check if we've run out of potential matches
    if (this.currentIndex >= this.potentialMatches.length) {
      this.noMoreMatches = true;
    }
  }
  
  // Refresh potential matches
  refreshMatches(): void {
    this.currentIndex = 0;
    this.noMoreMatches = false;
    this.loadPotentialMatches();
  }
  
  // Close match modal
  closeMatchModal(): void {
    this.showMatchModal = false;
    this.matchedUser = null;
  }
  
  // Send message to a matched user
  sendMessage(userId: string): void {
    // In a real app, navigate to messages or open a chat interface
    console.log('Send message to user:', userId);
  }
  
  // Unlike a previously liked user
  unlikeUser(user: MatchedUser): void {
    this.matchingService.unlikeUser(user.id).subscribe({
      next: () => {
        // Remove from liked users list
        this.likedUsers = this.likedUsers.filter(u => u.id !== user.id);
        
        // If this was a mutual match, reload mutual matches
        if (this.mutualMatches.some(m => m.id === user.id)) {
          this.loadMutualMatches();
        }
      },
      error: (error) => {
        console.error('Error unliking user', error);
      }
    });
  }
  
  // Check if current user has already liked this user
  isLiked(userId: string): boolean {
    return this.likedUsers.some(u => u.id === userId);
  }
  
  // Get current potential match
  getCurrentMatch(): MatchedUser | null {
    return this.potentialMatches.length > this.currentIndex 
      ? this.potentialMatches[this.currentIndex] 
      : null;
  }
  
  // Check if an interest is selected for filtering
  isInterestSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }
}