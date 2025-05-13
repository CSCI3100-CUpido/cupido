// src/app/components/auth/verification-code/verification-code.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { VerificationService } from '../../../services/verification.service';
import { AuthService } from '../../../services/auth.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-verification-code',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verification-code.component.html',
  styleUrls: ['./verification-code.component.css']
})
export class VerificationCodeComponent implements OnInit, OnDestroy {
  verificationForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';
  currentEmail = '';
  remainingTime = 0;
  timerInterval: any;
  demoCodeReceived = false;

  constructor(
    private formBuilder: FormBuilder,
    private verificationService: VerificationService,
    private authService: AuthService,
    private navigationService: NavigationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserEmail();
    this.startTimer();
  }

  initializeForm(): void {
    this.verificationForm = this.formBuilder.group({
      code: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
        Validators.pattern('^[0-9]*$')
      ]]
    });
  }

  loadUserEmail(): void {
    // Try to get email from navigation service first
    const email = this.navigationService.getEmail();
    if (email) {
      this.currentEmail = email;
      this.resendCode();
      return;
    }

    // Fallback to current user
    const user = this.authService.getCurrentUser();
    if (user && user.email) {
      this.currentEmail = user.email;
      this.resendCode();
    } else {
      // Redirect to login if no user or email found
      this.router.navigate(['/auth/login']);
    }
  }

  startTimer(): void {
    // 30 minutes (in seconds)
    this.remainingTime = 30 * 60;
    
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      
      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  verifyCode(): void {
    if (this.verificationForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    const code = this.verificationForm.get('code')?.value;

    this.verificationService.verifyCode(this.currentEmail, code).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = response.message;
        
        // Update the current user to mark email as verified
        const currentUser = this.authService.getCurrentUser();
        if (currentUser) {
          currentUser.isEmailVerified = true;
          this.authService.setCurrentUser(currentUser);
        }
        
        // Navigate to profile setup after a delay
        setTimeout(() => {
          this.navigationService.navigateToProfileSetup();
        }, 1500);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Verification failed. Please try again.';
      }
    });
  }

  resendCode(): void {
    this.errorMessage = '';
    this.successMessage = '';
    
    this.verificationService.sendVerificationCode(this.currentEmail).subscribe({
      next: () => {
        // Simulate receiving the verification code
        const verificationService = this.verificationService as any;
        if (verificationService.verificationRequests && this.currentEmail) {
          const verification = verificationService.verificationRequests.get(this.currentEmail);
          if (verification && verification.code) {
            this.demoCodeReceived = true;
            this.successMessage = `Verification code sent! For demo: Your code is ${verification.code}`;
            
            // Optionally auto-fill the code for demo purposes
            setTimeout(() => {
              this.verificationForm.get('code')?.setValue(verification.code);
            }, 1500);
          } else {
            this.successMessage = 'Verification code has been sent to your email!';
          }
        } else {
          this.successMessage = 'Verification code has been sent to your email!';
        }
        
        // Reset the timer
        clearInterval(this.timerInterval);
        this.startTimer();
      },
      error: (error) => {
        this.errorMessage = error.message || 'Failed to send verification code. Please try again.';
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}