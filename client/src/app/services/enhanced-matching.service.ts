// src/app/services/enhanced-matching.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from './auth.service';
import { MockAuthService } from './mock-auth.service';
import { MatchingPreference, MatchedUser } from './matching.service';

@Injectable({
  providedIn: 'root'
})
export class EnhancedMatchingService {
  private apiUrl = `${environment.apiUrl}/matching`;
  private demoMode = environment.demoMode || true;
  
  // In-memory storage for demo mode
  private userPreferences: Map<string, MatchingPreference> = new Map();
  private likedUsers: Map<string, Set<string>> = new Map();
  private likedByUsers: Map<string, Set<string>> = new Map();
  private usersVerificationStatus: Map<string, boolean> = new Map();

  constructor(
    private http: HttpClient, 
    private mockAuthService: MockAuthService
  ) {
    // Initialize demo data if in demo mode
    if (this.demoMode) {
      this.initializeDemoData();
    }
  }

  private initializeDemoData(): void {
    // Get all users for demo
    this.mockAuthService.getAllUsers().subscribe({
      next: (users) => {
        // Initialize preferences, likes for each user
        users.forEach(user => {
          // Default preferences
          this.userPreferences.set(user.id, {
            minAge: 18,
            maxAge: 30,
            genderPreference: ['male', 'female', 'other'],
            interests: user.interests || [],
            campusPreference: ['CUHK']
          });
          
          // Empty likes sets
          this.likedUsers.set(user.id, new Set<string>());
          this.likedByUsers.set(user.id, new Set<string>());
          
          // Default verification status
          this.usersVerificationStatus.set(user.id, user.isEmailVerified || false);
        });
        
        // Set specific preferences for demo users
        if (users.length >= 6) {
          // David's preferences (ID 6)
          this.userPreferences.set('6', {
            minAge: 20,
            maxAge: 28,
            genderPreference: ['female'],
            interests: users.find(u => u.id === '6')?.interests || [],
            campusPreference: ['CUHK']
          });
          
          // Sophie's preferences (ID 5)
          this.userPreferences.set('5', {
            minAge: 22,
            maxAge: 32,
            genderPreference: ['male'],
            interests: users.find(u => u.id === '5')?.interests || [],
            campusPreference: ['CUHK']
          });
          
          // Setup some demo mutual likes
          this.likedUsers.get('6')?.add('5'); // David likes Sophie
          this.likedByUsers.get('5')?.add('6');
          
          this.likedUsers.get('5')?.add('6'); // Sophie likes David
          this.likedByUsers.get('6')?.add('5');
          
          this.likedUsers.get('4')?.add('2'); // Michael likes User
          this.likedByUsers.get('2')?.add('4');
          
          this.likedUsers.get('3')?.add('6'); // Jenny likes David
          this.likedByUsers.get('6')?.add('3');
        }
      },
      error: (error) => {
        console.error('Error initializing demo data for matching', error);
      }
    });
  }

  /**
   * Get potential matches for the current user
   */
  getPotentialMatches(): Observable<MatchedUser[]> {
    if (this.demoMode) {
      return this.getDemoPotentialMatches();
    }
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/potential`);
  }
  
  /**
   * Get matches (mutual likes) for the current user
   */
  getMatches(): Observable<MatchedUser[]> {
    if (this.demoMode) {
      return this.getDemoMatches();
    }
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/matches`);
  }
  
  /**
   * Get users who the current user has liked
   */
  getLikedUsers(): Observable<MatchedUser[]> {
    if (this.demoMode) {
      return this.getDemoLikedUsers();
    }
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/liked`);
  }
  
  /**
   * Get users who have liked the current user
   */
  getLikedByUsers(): Observable<MatchedUser[]> {
    if (this.demoMode) {
      return this.getDemoLikedByUsers();
    }
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/liked-by`);
  }
  
  /**
   * Like a user
   * @param userId User ID to like
   * @returns Whether a match was created
   */
  likeUser(userId: string): Observable<{ isMatch: boolean }> {
    if (this.demoMode) {
      return this.demoLikeUser(userId);
    }
    return this.http.post<{ isMatch: boolean }>(`${this.apiUrl}/like/${userId}`, {});
  }
  
  /**
   * Unlike a user
   * @param userId User ID to unlike
   */
  unlikeUser(userId: string): Observable<void> {
    if (this.demoMode) {
      return this.demoUnlikeUser(userId);
    }
    return this.http.delete<void>(`${this.apiUrl}/like/${userId}`);
  }
  
  /**
   * Get user preferences
   */
  getUserPreferences(): Observable<MatchingPreference> {
    if (this.demoMode) {
      return this.getDemoUserPreferences();
    }
    return this.http.get<MatchingPreference>(`${this.apiUrl}/preferences`);
  }
  
  /**
   * Update user preferences
   * @param preferences Matching preferences
   */
  updateUserPreferences(preferences: MatchingPreference): Observable<MatchingPreference> {
    if (this.demoMode) {
      return this.demoUpdateUserPreferences(preferences);
    }
    return this.http.put<MatchingPreference>(`${this.apiUrl}/preferences`, preferences);
  }
  
  /**
   * Verify user email status
   * @param userId User ID to verify
   * @param verified Verification status
   */
  updateVerificationStatus(userId: string, verified: boolean): Observable<boolean> {
    if (this.demoMode) {
      return this.demoUpdateVerificationStatus(userId, verified);
    }
    return this.http.put<boolean>(`${this.apiUrl}/verify/${userId}`, { verified });
  }
  
  /**
   * Check if a user is verified
   * @param userId User ID to check
   */
  isUserVerified(userId: string): Observable<boolean> {
    if (this.demoMode) {
      return this.demoIsUserVerified(userId);
    }
    return this.http.get<boolean>(`${this.apiUrl}/verify/${userId}`);
  }
  
  /**
   * Get recommended matches based on interests
   * @param count Number of matches to return
   */
  getRecommendedMatches(count: number = 10): Observable<MatchedUser[]> {
    if (this.demoMode) {
      return this.getDemoRecommendedMatches(count);
    }
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/recommended?count=${count}`);
  }
  
  // Demo mode implementations
  private getDemoPotentialMatches(): Observable<MatchedUser[]> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    
    return this.mockAuthService.getAllUsers().pipe(
      delay(500),
      map(users => {
        const currentPreferences = this.userPreferences.get(currentUser.id) || {
          minAge: 18,
          maxAge: 30,
          genderPreference: ['male', 'female', 'other'],
          interests: currentUser.interests || [],
          campusPreference: ['CUHK']
        };
        
        const likedUserIds = Array.from(this.likedUsers.get(currentUser.id) || new Set<string>());
        
        // Filter and score potential matches
        const potentialMatches: MatchedUser[] = [];
        
        users.forEach(user => {
          // Skip current user and already liked users
          if (user.id === currentUser.id || likedUserIds.includes(user.id)) {
            return;
          }
          
          // Calculate age
          const age = this.calculateAge(user.dateOfBirth);
          
          // Filter by age and gender preference
          if (age < currentPreferences.minAge || age > currentPreferences.maxAge) {
            return;
          }
          
          if (currentPreferences.genderPreference.length > 0 && 
              !currentPreferences.genderPreference.includes(user.gender || 'other')) {
            return;
          }
          
          // Calculate matching score based on shared interests
          const currentUserInterests = new Set(currentPreferences.interests);
          const potentialMatchInterests = new Set(user.interests || []);
          
          const sharedInterests = Array.from(currentUserInterests).filter(interest => 
            potentialMatchInterests.has(interest)
          );
          
          let compatibilityScore: number;
          
          if (currentUserInterests.size === 0) {
            compatibilityScore = 50; // Default compatibility if no interests set
          } else {
            // Calculate based on percentage of shared interests
            const sharedPercentage = sharedInterests.length / Math.max(currentUserInterests.size, 1);
            const interestBonus = Math.min(sharedInterests.length * 5, 20); // Bonus for number of shared interests
            compatibilityScore = Math.min(Math.round(sharedPercentage * 80) + interestBonus, 100);
          }
          
          // Only include users with reasonable compatibility
          if (compatibilityScore >= 30) {
            potentialMatches.push({
              id: user.id,
              username: user.username,
              age: age,
              photoUrl: user.photoUrl,
              bio: user.bio || '',
              city: user.city || 'Hong Kong',
              campus: 'CUHK', // Default for demo
              interests: user.interests || [],
              isOnline: Math.random() > 0.7, // Random online status for demo
              lastActive: user.lastActive,
              compatibilityScore: compatibilityScore,
              matchingInterests: sharedInterests
            });
          }
        });
        
        // Sort by compatibility score (highest first)
        return potentialMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      })
    );
  }
  
  private getDemoMatches(): Observable<MatchedUser[]> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    
    const likedUserIds = Array.from(this.likedUsers.get(currentUser.id) || new Set<string>());
    const likedByUserIds = Array.from(this.likedByUsers.get(currentUser.id) || new Set<string>());
    
    // Find mutual matches (users who are in both sets)
    const mutualMatchIds = likedUserIds.filter(id => likedByUserIds.includes(id));
    
    return this.mockAuthService.getAllUsers().pipe(
      delay(500),
      map(users => {
        const matches: MatchedUser[] = [];
        
        users.filter(u => mutualMatchIds.includes(u.id)).forEach(user => {
          // Calculate age
          const age = this.calculateAge(user.dateOfBirth);
          
          // Calculate matching score based on shared interests
          const currentUserInterests = new Set(currentUser.interests || []);
          const matchInterests = new Set(user.interests || []);
          
          const sharedInterests = Array.from(currentUserInterests).filter(interest => 
            matchInterests.has(interest)
          );
          
          let compatibilityScore: number;
          
          if (currentUserInterests.size === 0) {
            compatibilityScore = 50; // Default compatibility if no interests set
          } else {
            // Calculate based on percentage of shared interests
            const sharedPercentage = sharedInterests.length / Math.max(currentUserInterests.size, 1);
            const interestBonus = Math.min(sharedInterests.length * 5, 20); // Bonus for number of shared interests
            compatibilityScore = Math.min(Math.round(sharedPercentage * 80) + interestBonus, 100);
          }
          
          matches.push({
            id: user.id,
            username: user.username,
            age: age,
            photoUrl: user.photoUrl,
            bio: user.bio || '',
            city: user.city || 'Hong Kong',
            campus: 'CUHK', // Default for demo
            interests: user.interests || [],
            isOnline: Math.random() > 0.7, // Random online status for demo
            lastActive: user.lastActive,
            compatibilityScore: compatibilityScore,
            matchingInterests: sharedInterests
          });
        });
        
        return matches;
      })
    );
  }
  
  private getDemoLikedUsers(): Observable<MatchedUser[]> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    
    const likedUserIds = Array.from(this.likedUsers.get(currentUser.id) || new Set<string>());
    
    return this.mockAuthService.getAllUsers().pipe(
      delay(500),
      map(users => {
        const likedUsers: MatchedUser[] = [];
        
        users.filter(u => likedUserIds.includes(u.id)).forEach(user => {
          // Calculate age
          const age = this.calculateAge(user.dateOfBirth);
          
          // Calculate matching score based on shared interests
          const currentUserInterests = new Set(currentUser.interests || []);
          const likedUserInterests = new Set(user.interests || []);
          
          const sharedInterests = Array.from(currentUserInterests).filter(interest => 
            likedUserInterests.has(interest)
          );
          
          let compatibilityScore: number;
          
          if (currentUserInterests.size === 0) {
            compatibilityScore = 50; // Default compatibility if no interests set
          } else {
            // Calculate based on percentage of shared interests
            const sharedPercentage = sharedInterests.length / Math.max(currentUserInterests.size, 1);
            const interestBonus = Math.min(sharedInterests.length * 5, 20); // Bonus for number of shared interests
            compatibilityScore = Math.min(Math.round(sharedPercentage * 80) + interestBonus, 100);
          }
          
          likedUsers.push({
            id: user.id,
            username: user.username,
            age: age,
            photoUrl: user.photoUrl,
            bio: user.bio || '',
            city: user.city || 'Hong Kong',
            campus: 'CUHK', // Default for demo
            interests: user.interests || [],
            isOnline: Math.random() > 0.7, // Random online status for demo
            lastActive: user.lastActive,
            compatibilityScore: compatibilityScore,
            matchingInterests: sharedInterests
          });
        });
        
        return likedUsers;
      })
    );
  }
  
  private getDemoLikedByUsers(): Observable<MatchedUser[]> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    
    const likedByUserIds = Array.from(this.likedByUsers.get(currentUser.id) || new Set<string>());
    
    return this.mockAuthService.getAllUsers().pipe(
      delay(500),
      map(users => {
        const likedByUsers: MatchedUser[] = [];
        
        users.filter(u => likedByUserIds.includes(u.id)).forEach(user => {
          // Calculate age
          const age = this.calculateAge(user.dateOfBirth);
          
          // Calculate matching score based on shared interests
          const currentUserInterests = new Set(currentUser.interests || []);
          const likedByUserInterests = new Set(user.interests || []);
          
          const sharedInterests = Array.from(currentUserInterests).filter(interest => 
            likedByUserInterests.has(interest)
          );
          
          let compatibilityScore: number;
          
          if (currentUserInterests.size === 0) {
            compatibilityScore = 50; // Default compatibility if no interests set
          } else {
            // Calculate based on percentage of shared interests
            const sharedPercentage = sharedInterests.length / Math.max(currentUserInterests.size, 1);
            const interestBonus = Math.min(sharedInterests.length * 5, 20); // Bonus for number of shared interests
            compatibilityScore = Math.min(Math.round(sharedPercentage * 80) + interestBonus, 100);
          }
          
          likedByUsers.push({
            id: user.id,
            username: user.username,
            age: age,
            photoUrl: user.photoUrl,
            bio: user.bio || '',
            city: user.city || 'Hong Kong',
            campus: 'CUHK', // Default for demo
            interests: user.interests || [],
            isOnline: Math.random() > 0.7, // Random online status for demo
            lastActive: user.lastActive,
            compatibilityScore: compatibilityScore,
            matchingInterests: sharedInterests
          });
        });
        
        return likedByUsers;
      })
    );
  }
  
  private demoLikeUser(userId: string): Observable<{ isMatch: boolean }> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of({ isMatch: false });
    }
    
    // Add to liked users
    const likedUsersSet = this.likedUsers.get(currentUser.id) || new Set<string>();
    likedUsersSet.add(userId);
    this.likedUsers.set(currentUser.id, likedUsersSet);
    
    // Add to liked by for the target user
    const likedByUsersSet = this.likedByUsers.get(userId) || new Set<string>();
    likedByUsersSet.add(currentUser.id);
    this.likedByUsers.set(userId, likedByUsersSet);
    
    // Check if it's a match (both users liked each other)
    const isMatch = (this.likedByUsers.get(currentUser.id) || new Set<string>()).has(userId);
    
    return of({ isMatch }).pipe(delay(300));
  }
  
  private demoUnlikeUser(userId: string): Observable<void> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of(undefined);
    }
    
    // Remove from liked users
    const likedUsersSet = this.likedUsers.get(currentUser.id);
    if (likedUsersSet) {
      likedUsersSet.delete(userId);
    }
    
    // Remove from liked by for the target user
    const likedByUsersSet = this.likedByUsers.get(userId);
    if (likedByUsersSet) {
      likedByUsersSet.delete(currentUser.id);
    }
    
    return of(undefined).pipe(delay(300));
  }
  
  private getDemoUserPreferences(): Observable<MatchingPreference> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of({
        minAge: 18,
        maxAge: 30,
        genderPreference: ['male', 'female', 'other'],
        interests: [],
        campusPreference: ['CUHK']
      });
    }
    
    const preferences = this.userPreferences.get(currentUser.id) || {
      minAge: 18,
      maxAge: 30,
      genderPreference: ['male', 'female', 'other'],
      interests: currentUser.interests || [],
      campusPreference: ['CUHK']
    };
    
    return of(preferences).pipe(delay(300));
  }
  
  private demoUpdateUserPreferences(preferences: MatchingPreference): Observable<MatchingPreference> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of(preferences);
    }
    
    this.userPreferences.set(currentUser.id, preferences);
    
    return of(preferences).pipe(delay(300));
  }
  
  private demoUpdateVerificationStatus(userId: string, verified: boolean): Observable<boolean> {
    this.usersVerificationStatus.set(userId, verified);
    return of(verified).pipe(delay(300));
  }
  
  private demoIsUserVerified(userId: string): Observable<boolean> {
    const status = this.usersVerificationStatus.get(userId) || false;
    return of(status).pipe(delay(300));
  }
  
  private getDemoRecommendedMatches(count: number): Observable<MatchedUser[]> {
    // This will essentially return the most compatible potential matches
    return this.getDemoPotentialMatches().pipe(
      map(matches => matches.slice(0, count))
    );
  }
  
  // Helper function to calculate age
  private calculateAge(dateOfBirth?: Date): number {
    if (!dateOfBirth) return 20; // Default age if not provided
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}