// src/app/services/mock-matching.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from './auth.service';
import { MockAuthService } from './mock-auth.service';
import { MatchingPreference, MatchedUser } from './matching.service';

@Injectable({
  providedIn: 'root'
})
export class MockMatchingService {
  // In-memory storage for demo mode
  private userPreferences: Map<string, MatchingPreference> = new Map();
  private likedUsers: Map<string, Set<string>> = new Map();
  private likedByUsers: Map<string, Set<string>> = new Map();
  private usersVerificationStatus: Map<string, boolean> = new Map();

  constructor(private mockAuthService: MockAuthService) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
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
        
        // Set specific preferences for users
        
        // User (ID 2) - Female looking for males
        this.userPreferences.set('2', {
          minAge: 20,
          maxAge: 30,
          genderPreference: ['male'],
          interests: users.find(u => u.id === '2')?.interests || [],
          campusPreference: ['CUHK']
        });
        
        // Jenny (ID 3) - Female looking for males
        this.userPreferences.set('3', {
          minAge: 22,
          maxAge: 35,
          genderPreference: ['male'],
          interests: users.find(u => u.id === '3')?.interests || [],
          campusPreference: ['CUHK']
        });
        
        // Michael (ID 4) - Male looking for females
        this.userPreferences.set('4', {
          minAge: 18,
          maxAge: 28,
          genderPreference: ['female'],
          interests: users.find(u => u.id === '4')?.interests || [],
          campusPreference: ['CUHK']
        });
        
        // Sophie (ID 5) - Female looking for males
        this.userPreferences.set('5', {
          minAge: 22,
          maxAge: 32,
          genderPreference: ['male'],
          interests: users.find(u => u.id === '5')?.interests || [],
          campusPreference: ['CUHK']
        });
        
        // David (ID 6) - Male looking for females
        this.userPreferences.set('6', {
          minAge: 20,
          maxAge: 28,
          genderPreference: ['female'],
          interests: users.find(u => u.id === '6')?.interests || [],
          campusPreference: ['CUHK']
        });

        // Lily (ID 7) - Female looking for males
        this.userPreferences.set('7', {
          minAge: 21,
          maxAge: 29,
          genderPreference: ['male'],
          interests: users.find(u => u.id === '7')?.interests || [],
          campusPreference: ['CUHK']
        });

        // Alex (ID 8) - Male looking for females
        this.userPreferences.set('8', {
          minAge: 19,
          maxAge: 27,
          genderPreference: ['female'],
          interests: users.find(u => u.id === '8')?.interests || [],
          campusPreference: ['CUHK']
        });

        // Rachel (ID 9) - Female looking for all genders
        this.userPreferences.set('9', {
          minAge: 20,
          maxAge: 32,
          genderPreference: ['male', 'female', 'other'],
          interests: users.find(u => u.id === '9')?.interests || [],
          campusPreference: ['CUHK']
        });

        // Daniel (ID 10) - Male looking for females
        this.userPreferences.set('10', {
          minAge: 20,
          maxAge: 30,
          genderPreference: ['female'],
          interests: users.find(u => u.id === '10')?.interests || [],
          campusPreference: ['CUHK']
        });

        // Olivia (ID 11) - Female looking for males
        this.userPreferences.set('11', {
          minAge: 22,
          maxAge: 35,
          genderPreference: ['male'],
          interests: users.find(u => u.id === '11')?.interests || [],
          campusPreference: ['CUHK']
        });

        // William (ID 12) - Male looking for females
        this.userPreferences.set('12', {
          minAge: 18,
          maxAge: 28,
          genderPreference: ['female'],
          interests: users.find(u => u.id === '12')?.interests || [],
          campusPreference: ['CUHK']
        });
        
        // Setup some demo mutual likes
        
        // David (6) and Sophie (5) like each other
        this.likedUsers.get('6')?.add('5'); // David likes Sophie
        this.likedByUsers.get('5')?.add('6');
        
        this.likedUsers.get('5')?.add('6'); // Sophie likes David
        this.likedByUsers.get('6')?.add('5');
        
        // Michael (4) and User (2) like each other
        this.likedUsers.get('4')?.add('2'); // Michael likes User
        this.likedByUsers.get('2')?.add('4');
        
        this.likedUsers.get('2')?.add('4'); // User likes Michael
        this.likedByUsers.get('4')?.add('2');
        
        // Jenny (3) likes David (6) but not mutual
        this.likedUsers.get('3')?.add('6'); // Jenny likes David
        this.likedByUsers.get('6')?.add('3');
        
        // Alex (8) and Lily (7) like each other
        this.likedUsers.get('8')?.add('7'); // Alex likes Lily
        this.likedByUsers.get('7')?.add('8');
        
        this.likedUsers.get('7')?.add('8'); // Lily likes Alex
        this.likedByUsers.get('8')?.add('7');
        
        // Daniel (10) likes Olivia (11) but not mutual
        this.likedUsers.get('10')?.add('11'); // Daniel likes Olivia
        this.likedByUsers.get('11')?.add('10');
        
        // William (12) and Rachel (9) like each other
        this.likedUsers.get('12')?.add('9'); // William likes Rachel
        this.likedByUsers.get('9')?.add('12');
        
        this.likedUsers.get('9')?.add('12'); // Rachel likes William
        this.likedByUsers.get('12')?.add('9');
        
        // Olivia (11) likes David (6) but not mutual
        this.likedUsers.get('11')?.add('6'); // Olivia likes David
        this.likedByUsers.get('6')?.add('11');
        
        // User (2) likes William (12) but not mutual
        this.likedUsers.get('2')?.add('12'); // User likes William
        this.likedByUsers.get('12')?.add('2');
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
              matchingInterests: sharedInterests,
              isLiked: likedUserIds.includes(user.id)
            });
          }
        });
        
        // Sort by compatibility score (highest first)
        return potentialMatches.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      })
    );
  }
  
  /**
   * Get matches (mutual likes) for the current user
   */
  getMatches(): Observable<MatchedUser[]> {
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
            matchingInterests: sharedInterests,
            isLiked: true // Must be liked since these are mutual matches
          });
        });
        
        return matches;
      })
    );
  }
  
  /**
   * Get users who the current user has liked
   */
  getLikedUsers(): Observable<MatchedUser[]> {
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
            matchingInterests: sharedInterests,
            isLiked: true // These are users the current user has liked
          });
        });
        
        return likedUsers;
      })
    );
  }
  
  /**
   * Get users who have liked the current user
   */
  getLikedByUsers(): Observable<MatchedUser[]> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of([]);
    }
    
    const likedByUserIds = Array.from(this.likedByUsers.get(currentUser.id) || new Set<string>());
    const likedUserIds = Array.from(this.likedUsers.get(currentUser.id) || new Set<string>());
    
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
            matchingInterests: sharedInterests,
            isLiked: likedUserIds.includes(user.id) // Check if current user has liked this user back
          });
        });
        
        return likedByUsers;
      })
    );
  }
  
  /**
   * Like a user
   * @param userId User ID to like
   * @returns Whether a match was created
   */
  likeUser(userId: string): Observable<{ isMatch: boolean }> {
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
  
  /**
   * Unlike a user
   * @param userId User ID to unlike
   */
  unlikeUser(userId: string): Observable<void> {
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
  
  /**
   * Get user preferences
   */
  getUserPreferences(): Observable<MatchingPreference> {
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
  
  /**
   * Update user preferences
   * @param preferences Matching preferences
   */
  updateUserPreferences(preferences: MatchingPreference): Observable<MatchingPreference> {
    const currentUser = this.mockAuthService.getCurrentUser();
    if (!currentUser) {
      return of(preferences);
    }
    
    this.userPreferences.set(currentUser.id, preferences);
    
    return of(preferences).pipe(delay(300));
  }
  
  /**
   * Verify user email status
   * @param userId User ID to verify
   * @param verified Verification status
   */
  updateVerificationStatus(userId: string, verified: boolean): Observable<boolean> {
    this.usersVerificationStatus.set(userId, verified);
    return of(verified).pipe(delay(300));
  }
  
  /**
   * Check if a user is verified
   * @param userId User ID to check
   */
  isUserVerified(userId: string): Observable<boolean> {
    const status = this.usersVerificationStatus.get(userId) || false;
    return of(status).pipe(delay(300));
  }
  
  /**
   * Get recommended matches based on interests
   * @param count Number of matches to return
   */
  getRecommendedMatches(count: number = 10): Observable<MatchedUser[]> {
    // This will essentially return the most compatible potential matches
    return this.getPotentialMatches().pipe(
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