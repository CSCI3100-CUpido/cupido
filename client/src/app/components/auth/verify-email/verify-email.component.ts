import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css']
})
export class VerifyEmailComponent implements OnInit {
  isVerifying = false;
  isVerified = false;
  isResending = false;
  verificationError: string | null = null;
  isTokenVerification = false;
  currentEmail: string = '';

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Check for token in URL parameters
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.isTokenVerification = true;
        this.verifyEmail(token);
      }
    });

    // Try to get current user email from local storage
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const user = JSON.parse(userString);
        this.currentEmail = user.email || 'your CUHK email address';
      } catch (error) {
        this.currentEmail = 'your CUHK email address';
      }
    } else {
      this.currentEmail = 'your CUHK email address';
    }
  }

  verifyEmail(token: string): void {
    this.isVerifying = true;
    this.verificationError = null;

    this.authService.verifyEmail(token).subscribe({
      next: () => {
        this.isVerifying = false;
        this.isVerified = true;
        // Success message would normally use ToastrService
        console.log('Your email has been successfully verified!');
        
        // Update the local user object to reflect verified status
        const userString = localStorage.getItem('user');
        if (userString) {
          try {
            const user = JSON.parse(userString);
            user.isEmailVerified = true;
            localStorage.setItem('user', JSON.stringify(user));
            this.authService.setCurrentUser(user);
          } catch (error) {
            console.error('Error updating user in localStorage', error);
          }
        }
      },
      error: (error) => {
        this.isVerifying = false;
        this.verificationError = error.error || 'Email verification failed. The link may have expired or is invalid.';
        console.error(this.verificationError);
      }
    });
  }

  resendVerificationEmail(): void {
    this.isResending = true;
    this.verificationError = null;

    this.authService.resendVerificationEmail().subscribe({
      next: () => {
        this.isResending = false;
        console.log('Verification email has been resent. Please check your inbox.');
      },
      error: (error) => {
        this.isResending = false;
        this.verificationError = error.error || 'Failed to resend verification email. Please try again later.';
        console.error(this.verificationError);
      }
    });
  }
}