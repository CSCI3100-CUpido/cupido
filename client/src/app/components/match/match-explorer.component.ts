// src/app/components/match/match-explorer.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnhancedMatchingService} from '../../services/enhanced-matching.service';
import { MatchedUser } from '../../services/matching.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-match-explorer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './match-explorer.component.html',
  styleUrls: ['./match-explorer.component.css']
})
export class MatchExplorerComponent implements OnInit {
  recommendedMatches: MatchedUser[] = [];
  filteredMatches: MatchedUser[] = [];
  isLoading = false;
  errorMessage = '';
  searchTerm = '';
  
  // Filter states
  selectedInterests: string[] = [];
  minAge = 18;
  maxAge = 50;
  selectedCampus: string = 'All';
  onlineOnly = false;
  
  // Available filters
  allInterests = [
    'Sports', 'Movies', 'Music', 'Reading', 'Art', 'Gaming',
    'Cooking', 'Travel', 'Photography', 'Technology', 'Hiking',
    'Dancing', 'Writing', 'Fashion', 'Fitness', 'Programming',
    'Basketball', 'Swimming', 'Marketing', 'Social Media',
    'Literature', 'Arts', 'Languages', 'Biology', 'Physics',
    'Guitar', 'Astronomy', 'Environmental Protection'
  ];
  
  campuses = ['All', 'CUHK', 'HKU', 'HKUST', 'PolyU', 'CityU', 'HKBU', 'LingU', 'EdUHK'];
  
  constructor(
    private matchingService: EnhancedMatchingService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadRecommendedMatches();
  }
  
  loadRecommendedMatches(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.matchingService.getRecommendedMatches(30).subscribe({
      next: (matches) => {
        this.recommendedMatches = matches;
        this.applyFilters(); // Apply initial filters
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading recommended matches', error);
        this.errorMessage = 'Failed to load matches. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  applyFilters(): void {
    this.filteredMatches = this.recommendedMatches.filter(match => {
      // Filter by age
      if (match.age < this.minAge || match.age > this.maxAge) {
        return false;
      }
      
      // Filter by online status
      if (this.onlineOnly && !match.isOnline) {
        return false;
      }
      
      // Filter by campus
      if (this.selectedCampus !== 'All' && match.campus !== this.selectedCampus) {
        return false;
      }
      
      // Filter by interests
      if (this.selectedInterests.length > 0) {
        const hasMatchingInterest = match.interests.some(interest => 
          this.selectedInterests.includes(interest)
        );
        if (!hasMatchingInterest) {
          return false;
        }
      }
      
      // Filter by search term
      if (this.searchTerm && this.searchTerm.trim() !== '') {
        const term = this.searchTerm.toLowerCase();
        return match.username.toLowerCase().includes(term) || 
               (match.bio && match.bio.toLowerCase().includes(term));
      }
      
      return true;
    });
    
    // Sort by compatibility score (highest first)
    this.filteredMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  }
  
  toggleInterestFilter(interest: string): void {
    const index = this.selectedInterests.indexOf(interest);
    if (index === -1) {
      this.selectedInterests.push(interest);
    } else {
      this.selectedInterests.splice(index, 1);
    }
    this.applyFilters();
  }
  
  isInterestSelected(interest: string): boolean {
    return this.selectedInterests.includes(interest);
  }
  
  clearFilters(): void {
    this.selectedInterests = [];
    this.minAge = 18;
    this.maxAge = 50;
    this.selectedCampus = 'All';
    this.onlineOnly = false;
    this.searchTerm = '';
    this.applyFilters();
  }
  
  likeUser(user: MatchedUser, event: Event): void {
    event.stopPropagation();
    
    this.matchingService.likeUser(user.id).subscribe({
      next: (response) => {
        user.isLiked = true;
        
        if (response.isMatch) {
          // Handle match notification in a real application
          alert(`You matched with ${user.username}!`);
        }
      },
      error: (error) => {
        console.error('Error liking user', error);
      }
    });
  }
  
  unlikeUser(user: MatchedUser, event: Event): void {
    event.stopPropagation();
    
    this.matchingService.unlikeUser(user.id).subscribe({
      next: () => {
        user.isLiked = false;
      },
      error: (error) => {
        console.error('Error unliking user', error);
      }
    });
  }
  
  refreshMatches(): void {
    this.loadRecommendedMatches();
  }
  
  calculateSharedInterestsText(user: MatchedUser): string {
    const count = user.matchingInterests.length;
    
    if (count === 0) {
      return 'No shared interests';
    } else if (count === 1) {
      return '1 shared interest';
    } else {
      return `${count} shared interests`;
    }
  }
}