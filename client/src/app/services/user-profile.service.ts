// src/app/services/user-profile.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
export class UserProfileService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}
  
  /**
   * Get user profile by ID
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/${userId}/profile`);
  }
  
  /**
   * Update user profile
   */
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.apiUrl}/${userId}/profile`, profile);
  }
  
  /**
   * Check if profile is complete
   */
  isProfileComplete(userId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/${userId}/profile/complete`);
  }
  
  /**
   * Get profile completion steps
   */
  getProfileCompletionSteps(userId: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/${userId}/profile/steps`);
  }
}