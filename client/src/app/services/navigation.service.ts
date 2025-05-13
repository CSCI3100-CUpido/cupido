// src/app/services/navigation.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

export enum AuthStep {
  Register = 'register',
  Verification = 'verification',
  ProfileSetup = 'profile-setup',
  Complete = 'complete'
}

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private authFlowSubject = new BehaviorSubject<AuthStep | null>(null);
  authFlow$ = this.authFlowSubject.asObservable();
  
  private emailSubject = new BehaviorSubject<string>('');
  email$ = this.emailSubject.asObservable();

  constructor(private router: Router) {}

  /**
   * Start the authentication flow from registration
   * @param email User's email
   */
  startAuthFlow(email: string): void {
    this.emailSubject.next(email);
    this.authFlowSubject.next(AuthStep.Register);
    localStorage.setItem('authFlow', AuthStep.Register);
    localStorage.setItem('authEmail', email);
  }

  /**
   * Navigate to verification step
   */
  navigateToVerification(): void {
    this.authFlowSubject.next(AuthStep.Verification);
    localStorage.setItem('authFlow', AuthStep.Verification);
    this.router.navigate(['/auth/verification-code']);
  }

  /**
   * Navigate to profile setup step
   */
  navigateToProfileSetup(): void {
    this.authFlowSubject.next(AuthStep.ProfileSetup);
    localStorage.setItem('authFlow', AuthStep.ProfileSetup);
    this.router.navigate(['/profile-setup']);
  }

  /**
   * Complete the authentication flow
   */
  completeAuthFlow(): void {
    this.authFlowSubject.next(AuthStep.Complete);
    localStorage.setItem('authFlow', AuthStep.Complete);
    // Clear temporary data
    localStorage.removeItem('authFlow');
    localStorage.removeItem('authEmail');
    this.router.navigate(['/match']);
  }

  /**
   * Restore auth flow state from local storage
   */
  restoreAuthFlow(): void {
    const flowStep = localStorage.getItem('authFlow') as AuthStep;
    const email = localStorage.getItem('authEmail');
    
    if (flowStep) {
      this.authFlowSubject.next(flowStep);
    }
    
    if (email) {
      this.emailSubject.next(email);
    }
  }

  /**
   * Get current authentication flow step
   */
  getCurrentStep(): AuthStep | null {
    return this.authFlowSubject.value;
  }

  /**
   * Get stored email
   */
  getEmail(): string {
    return this.emailSubject.value;
  }
}