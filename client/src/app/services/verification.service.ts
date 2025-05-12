// src/app/services/verification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface VerificationRequest {
  email: string;
  code?: string;
  isVerified?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class VerificationService {
  private apiUrl = `${environment.apiUrl}/verification`;
  
  constructor(private http: HttpClient) {}
  
  /**
   * Send verification code to user email
   * @param email User email
   * @returns Observable of success
   */
  sendVerificationCode(email: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.apiUrl}/send-code`, { email });
  }
  
  /**
   * Verify code entered by user
   * @param email User email
   * @param code Verification code
   * @returns Observable of verification result
   */
  verifyCode(email: string, code: string): Observable<{ success: boolean, message: string }> {
    return this.http.post<{ success: boolean, message: string }>(`${this.apiUrl}/verify-code`, { email, code });
  }
  
  /**
   * Check if email is verified
   * @param email User email
   * @returns Observable of verification status
   */
  isEmailVerified(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/status/${email}`);
  }
}