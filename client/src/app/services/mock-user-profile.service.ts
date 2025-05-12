// src/app/services/mock-user-profile.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from './auth.service';
import { MockAuthService } from './mock-auth.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  photoUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
  country?: string;
  bio?: string;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  campus?: string;
  department?: string;
  graduationYear?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockUserProfileService {
  // In-memory storage for mock
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor(private mockAuthService: MockAuthService) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.mockAuthService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach(user => {
          // Create profile for each user
          const profile: UserProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            photoUrl: user.photoUrl,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            interests: user.interests,
            city: user.city,
            country: user.country,
            bio: user.bio,
            isEmailVerified: user.isEmailVerified,
            isProfileComplete: this.calculateProfileCompletion(user),
            campus: 'CUHK', // Default for mock
            department: this.getRandomDepartment(),
            graduationYear: 2023 + Math.floor(Math.random() * 4) // Random graduation year
          };
          
          this.userProfiles.set(user.id, profile);
        });
      },
      error: (error) => {
        console.error('Error initializing mock user profiles', error);
      }
    });
  }
  
  /**
   * Calculate profile completion percentage
   */
  private calculateProfileCompletion(user: User): boolean {
    // Check if all required fields are filled
    const requiredFields = [
      user.username,
      user.email,
      user.photoUrl,
      user.dateOfBirth,
      user.gender,
      user.bio,
      user.city
    ];
    
    // 修复类型错误，使用空值合并运算符确保返回布尔值
    const hasInterests = (user.interests?.length ?? 0) >= 3;
    
    return !requiredFields.some(field => !field) && hasInterests;
  }
  
  /**
   * Get random department for mock data
   */
  private getRandomDepartment(): string {
    const departments = [
      'Computer Science',
      'Business Administration',
      'Engineering',
      'Social Sciences',
      'Medicine',
      'Law',
      'Arts',
      'Education',
      'Science'
    ];
    
    return departments[Math.floor(Math.random() * departments.length)];
  }
  
  /**
   * Get user profile by ID
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      // If profile not found, fetch user and create profile
      return this.mockAuthService.getUserById(userId).pipe(
        map(user => {
          const newProfile: UserProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            photoUrl: user.photoUrl,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            interests: user.interests,
            city: user.city,
            country: user.country,
            bio: user.bio,
            isEmailVerified: user.isEmailVerified,
            isProfileComplete: this.calculateProfileCompletion(user),
            campus: 'CUHK', // Default for mock
            department: this.getRandomDepartment(),
            graduationYear: 2023 + Math.floor(Math.random() * 4) // Random graduation year
          };
          
          this.userProfiles.set(userId, newProfile);
          return newProfile;
        })
      );
    }
    
    return of(profile).pipe(delay(300));
  }
  
  /**
   * Update user profile
   */
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    // Get existing profile
    const existingProfile = this.userProfiles.get(userId);
    
    if (!existingProfile) {
      return throwError(() => new Error('User profile not found'));
    }
    
    // Update profile
    const updatedProfile = {
      ...existingProfile,
      ...profile,
      // Recalculate profile completion
      isProfileComplete: this.calculateProfileCompletionFromProfile({
        ...existingProfile,
        ...profile
      })
    };
    
    // Save updated profile
    this.userProfiles.set(userId, updatedProfile);
    
    // Also update the user object
    this.mockAuthService.updateUserProfile(profile as Partial<User>).subscribe();
    
    return of(updatedProfile).pipe(delay(500));
  }
  
  private calculateProfileCompletionFromProfile(profile: UserProfile): boolean {
    // Check if all required fields are filled
    const requiredFields = [
      profile.username,
      profile.email,
      profile.photoUrl,
      profile.dateOfBirth,
      profile.gender,
      profile.bio,
      profile.city
    ];
    
    // 修复类型错误，使用空值合并运算符确保返回布尔值
    const hasInterests = (profile.interests?.length ?? 0) >= 3;
    
    return !requiredFields.some(field => !field) && hasInterests;
  }
  
  /**
   * Check if profile is complete
   */
  isProfileComplete(userId: string): Observable<boolean> {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return of(false).pipe(delay(300));
    }
    
    return of(profile.isProfileComplete).pipe(delay(300));
  }
  
  /**
   * Get profile completion steps
   */
  getProfileCompletionSteps(userId: string): Observable<string[]> {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return of([
        'Upload a profile photo',
        'Add your birthday',
        'Select your gender',
        'Write a bio',
        'Add your location',
        'Select at least 3 interests'
      ]).pipe(delay(300));
    }
    
    const steps: string[] = [];
    
    if (!profile.photoUrl) {
      steps.push('Upload a profile photo');
    }
    
    if (!profile.dateOfBirth) {
      steps.push('Add your birthday');
    }
    
    if (!profile.gender) {
      steps.push('Select your gender');
    }
    
    if (!profile.bio) {
      steps.push('Write a bio');
    }
    
    if (!profile.city) {
      steps.push('Add your location');
    }
    
    if (!profile.interests || profile.interests.length < 3) {
      steps.push('Select at least 3 interests');
    }
    
    return of(steps).pipe(delay(300));
  }
}