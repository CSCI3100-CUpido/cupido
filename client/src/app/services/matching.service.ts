// src/app/services/matching.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface MatchingPreference {
  minAge: number;
  maxAge: number;
  genderPreference: string[];
  interests: string[];
  campusPreference: string[];
}

export interface MatchedUser {
  id: string;
  username: string;
  age: number;
  photoUrl?: string;
  bio?: string;
  city?: string;
  campus?: string;
  interests: string[];
  isOnline: boolean;
  lastActive?: Date;
  compatibilityScore: number;
  matchingInterests: string[];
  isLiked?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private apiUrl = `${environment.apiUrl}/matching`;

  constructor(private http: HttpClient) {}

  /**
   * Get potential matches for the current user
   */
  getPotentialMatches(): Observable<MatchedUser[]> {
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/potential`);
  }
  
  /**
   * Get matches (mutual likes) for the current user
   */
  getMatches(): Observable<MatchedUser[]> {
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/matches`);
  }
  
  /**
   * Get users who the current user has liked
   */
  getLikedUsers(): Observable<MatchedUser[]> {
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/liked`);
  }
  
  /**
   * Get users who have liked the current user
   */
  getLikedByUsers(): Observable<MatchedUser[]> {
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/liked-by`);
  }
  
  /**
   * Like a user
   * @param userId User ID to like
   * @returns Whether a match was created
   */
  likeUser(userId: string): Observable<{ isMatch: boolean }> {
    return this.http.post<{ isMatch: boolean }>(`${this.apiUrl}/like/${userId}`, {});
  }
  
  /**
   * Unlike a user
   * @param userId User ID to unlike
   */
  unlikeUser(userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/like/${userId}`);
  }
  
  /**
   * Get user preferences
   */
  getUserPreferences(): Observable<MatchingPreference> {
    return this.http.get<MatchingPreference>(`${this.apiUrl}/preferences`);
  }
  
  /**
   * Update user preferences
   * @param preferences Matching preferences
   */
  updateUserPreferences(preferences: MatchingPreference): Observable<MatchingPreference> {
    return this.http.put<MatchingPreference>(`${this.apiUrl}/preferences`, preferences);
  }
  
  /**
   * Verify user email status
   * @param userId User ID to verify
   * @param verified Verification status
   */
  updateVerificationStatus(userId: string, verified: boolean): Observable<boolean> {
    return this.http.put<boolean>(`${this.apiUrl}/verify/${userId}`, { verified });
  }
  
  /**
   * Check if a user is verified
   * @param userId User ID to check
   */
  isUserVerified(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/verify/${userId}`);
  }
  
  /**
   * Get recommended matches based on interests
   * @param count Number of matches to return
   */
  getRecommendedMatches(count: number = 10): Observable<MatchedUser[]> {
    return this.http.get<MatchedUser[]>(`${this.apiUrl}/recommended?count=${count}`);
  }
}