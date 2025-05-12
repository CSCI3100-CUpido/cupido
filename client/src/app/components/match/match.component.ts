// src/app/components/match/match.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchingService, MatchedUser, MatchingPreference } from '../../services/matching.service';
// import { TimeagoPipe } from '../../pipes/timeago.pipe';

@Component({
  selector: 'app-match',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.css']
})
export class MatchComponent implements OnInit {
  // Use a simple string type to avoid type comparison issues
  activeTab: string = 'discover';
  
  // User lists
  potentialMatches: MatchedUser[] = [];
  mutualMatches: MatchedUser[] = [];
  likedUsers: MatchedUser[] = [];
  likedByUsers: MatchedUser[] = [];
  
  // Current display
  displayedUsers: MatchedUser[] = [];
  
  // Status flags
  isLoading = false;
  isSaving = false;
  noMoreUsers = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  // Card animation
  currentCardIndex = 0;
  swipeDirection: 'none' | 'left' | 'right' = 'none';
  isAnimating = false;
  
  // Match notification
  showMatchNotification = false;
  matchedUser: MatchedUser | null = null;
  
  // Form related properties
  settingsForm!: FormGroup;
  
  // Available interests for selection
  allInterests = [
    'Sports', 'Movies', 'Music', 'Reading', 'Art', 'Gaming',
    'Cooking', 'Travel', 'Photography', 'Technology', 'Hiking',
    'Dancing', 'Writing', 'Fashion', 'Fitness', 'Programming',
    'Basketball', 'Swimming', 'Marketing', 'Social Media',
    'Literature', 'Arts', 'Languages', 'Biology', 'Physics',
    'Guitar', 'Astronomy', 'Environmental Protection'
  ];
  
  // Campus options
  campuses = ['CUHK', 'HKU', 'HKUST', 'PolyU', 'CityU', 'HKBU', 'LingU', 'EdUHK'];
  
  constructor(
    private matchingService: MatchingService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.loadPotentialMatches();
    this.initializeForm();
    this.loadUserPreferences();
  }
  
  initializeForm(): void {
    this.settingsForm = this.formBuilder.group({
      minAge: [18, [Validators.required, Validators.min(18), Validators.max(50)]],
      maxAge: [30, [Validators.required, Validators.min(18), Validators.max(50)]],
      genderPreference: this.formBuilder.group({
        male: [true],
        female: [true],
        other: [true]
      }),
      interests: [[]],
      campusPreference: [[]]
    });
  }
  
  // New handler methods for the age range inputs
  onMinAgeChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.settingsForm.patchValue({ minAge: value });
  }
  
  onMaxAgeChange(event: Event): void {
    const value = +(event.target as HTMLInputElement).value;
    this.settingsForm.patchValue({ maxAge: value });
  }
  
  loadUserPreferences(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.matchingService.getUserPreferences().subscribe({
      next: (preferences) => {
        this.updateFormFromPreferences(preferences);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading preferences', error);
        this.errorMessage = 'Failed to load preferences. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  updateFormFromPreferences(preferences: MatchingPreference): void {
    const genderPrefs = preferences.genderPreference || [];
    
    this.settingsForm.patchValue({
      minAge: preferences.minAge || 18,
      maxAge: preferences.maxAge || 30,
      genderPreference: {
        male: genderPrefs.includes('male'),
        female: genderPrefs.includes('female'),
        other: genderPrefs.includes('other')
      },
      interests: preferences.interests || [],
      campusPreference: preferences.campusPreference || ['CUHK']
    });
  }
  
  savePreferences(): void {
    if (this.settingsForm.invalid) {
      this.markFormGroupTouched(this.settingsForm);
      return;
    }
    
    this.isSaving = true;
    this.errorMessage = null;
    this.successMessage = null;
    
    const formValues = this.settingsForm.value;
    const genderPreference: string[] = [];
    
    if (formValues.genderPreference.male) genderPreference.push('male');
    if (formValues.genderPreference.female) genderPreference.push('female');
    if (formValues.genderPreference.other) genderPreference.push('other');
    
    const preferences: MatchingPreference = {
      minAge: formValues.minAge,
      maxAge: formValues.maxAge,
      genderPreference,
      interests: formValues.interests,
      campusPreference: formValues.campusPreference
    };
    
    this.matchingService.updateUserPreferences(preferences).subscribe({
      next: (updatedPreferences) => {
        this.updateFormFromPreferences(updatedPreferences);
        this.isSaving = false;
        this.successMessage = 'Preferences saved successfully!';
        
        // Clear success message after a delay
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        console.error('Error saving preferences', error);
        this.errorMessage = 'Failed to save preferences. Please try again.';
        this.isSaving = false;
      }
    });
  }
  
  resetForm(): void {
    this.loadUserPreferences();
  }
  
  isInterestSelected(interest: string): boolean {
    const selectedInterests = this.settingsForm.get('interests')?.value || [];
    return selectedInterests.includes(interest);
  }
  
  toggleInterest(interest: string): void {
    const selectedInterests = [...(this.settingsForm.get('interests')?.value || [])];
    const index = selectedInterests.indexOf(interest);
    
    if (index === -1) {
      selectedInterests.push(interest);
    } else {
      selectedInterests.splice(index, 1);
    }
    
    this.settingsForm.patchValue({ interests: selectedInterests });
  }
  
  isCampusSelected(campus: string): boolean {
    const selectedCampuses = this.settingsForm.get('campusPreference')?.value || [];
    return selectedCampuses.includes(campus);
  }
  
  toggleCampus(campus: string): void {
    const selectedCampuses = [...(this.settingsForm.get('campusPreference')?.value || [])];
    const index = selectedCampuses.indexOf(campus);
    
    if (index === -1) {
      selectedCampuses.push(campus);
    } else {
      selectedCampuses.splice(index, 1);
    }
    
    this.settingsForm.patchValue({ campusPreference: selectedCampuses });
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
  
  loadPotentialMatches(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.matchingService.getPotentialMatches().subscribe({
      next: (users) => {
        this.potentialMatches = users;
        this.noMoreUsers = users.length === 0;
        this.currentCardIndex = 0;
        this.isLoading = false;
        
        if (this.activeTab === 'discover') {
          this.displayedUsers = this.potentialMatches;
        }
      },
      error: (error) => {
        console.error('Error loading potential matches', error);
        this.errorMessage = 'Failed to load matches. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  loadMutualMatches(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.matchingService.getMatches().subscribe({
      next: (users) => {
        this.mutualMatches = users;
        this.isLoading = false;
        
        if (this.activeTab === 'matches') {
          this.displayedUsers = this.mutualMatches;
        }
      },
      error: (error) => {
        console.error('Error loading mutual matches', error);
        this.errorMessage = 'Failed to load matches. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  loadLikedUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.matchingService.getLikedUsers().subscribe({
      next: (users) => {
        this.likedUsers = users;
        this.isLoading = false;
        
        if (this.activeTab === 'liked') {
          this.displayedUsers = this.likedUsers;
        }
      },
      error: (error) => {
        console.error('Error loading liked users', error);
        this.errorMessage = 'Failed to load liked users. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  loadLikedByUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.matchingService.getLikedByUsers().subscribe({
      next: (users) => {
        this.likedByUsers = users;
        this.isLoading = false;
        
        if (this.activeTab === 'likedBy') {
          this.displayedUsers = this.likedByUsers;
        }
      },
      error: (error) => {
        console.error('Error loading users who liked you', error);
        this.errorMessage = 'Failed to load users who liked you. Please try again.';
        this.isLoading = false;
      }
    });
  }
  
  // Keep the method parameter as a string to match the property type
  switchTab(tab: string): void {
    this.activeTab = tab;
    
    switch (tab) {
      case 'discover':
        if (this.potentialMatches.length === 0) {
          this.loadPotentialMatches();
        } else {
          this.displayedUsers = this.potentialMatches;
        }
        break;
      case 'matches':
        this.loadMutualMatches();
        break;
      case 'liked':
        this.loadLikedUsers();
        break;
      case 'likedBy':
        this.loadLikedByUsers();
        break;
    }
  }
  
  likeUser(user: MatchedUser): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.swipeDirection = 'right';
    
    setTimeout(() => {
      this.matchingService.likeUser(user.id).subscribe({
        next: (response) => {
          // Handle match
          if (response.isMatch) {
            this.matchedUser = user;
            this.showMatchNotification = true;
            // Refresh mutual matches
            this.loadMutualMatches();
          }
          
          // Move to next card
          this.nextCard();
        },
        error: (error) => {
          console.error('Error liking user', error);
          this.nextCard();
        }
      });
    }, 300); // Wait for animation
  }
  
  passUser(user: MatchedUser): void {
    if (this.isAnimating) return;
    
    this.isAnimating = true;
    this.swipeDirection = 'left';
    
    setTimeout(() => {
      this.nextCard();
    }, 300); // Wait for animation
  }
  
  nextCard(): void {
    this.currentCardIndex++;
    this.swipeDirection = 'none';
    this.isAnimating = false;
    
    // Check if we've run out of cards
    if (this.currentCardIndex >= this.potentialMatches.length) {
      this.noMoreUsers = true;
    }
  }
  
  toggleLike(user: MatchedUser): void {
    const isLiked = this.likedUsers.some(u => u.id === user.id);
    
    if (isLiked) {
      this.matchingService.unlikeUser(user.id).subscribe({
        next: () => {
          // Remove from liked users
          this.likedUsers = this.likedUsers.filter(u => u.id !== user.id);
          
          // If in liked tab, update displayed users
          if (this.activeTab === 'liked') {
            this.displayedUsers = this.likedUsers;
          }
          
          // Refresh data if needed
          if (this.activeTab === 'matches') {
            this.loadMutualMatches();
          }
        },
        error: (error) => {
          console.error('Error unliking user', error);
        }
      });
    } else {
      this.matchingService.likeUser(user.id).subscribe({
        next: (response) => {
          // Add to liked users if not already there
          if (!this.likedUsers.some(u => u.id === user.id)) {
            this.likedUsers.push(user);
          }
          
          // Handle match
          if (response.isMatch) {
            this.matchedUser = user;
            this.showMatchNotification = true;
            // Refresh mutual matches
            this.loadMutualMatches();
          }
        },
        error: (error) => {
          console.error('Error liking user', error);
        }
      });
    }
  }
  
  isUserLiked(userId: string): boolean {
    return this.likedUsers.some(u => u.id === userId);
  }
  
  closeMatchNotification(): void {
    this.showMatchNotification = false;
    this.matchedUser = null;
  }
  
  navigateToChat(userId: string): void {
    // This would navigate to chat with this user
    console.log('Navigate to chat with user ID:', userId);
  }
  
  refreshMatches(): void {
    this.loadPotentialMatches();
  }
}