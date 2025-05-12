// src/app/components/auth/login/login.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-icon">
          <i class="fa fa-user-circle"></i>
        </div>
        
        <div class="login-content">
          <h2>Welcome Back</h2>
          <p>Sign in to your Cupido account</p>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="Your CUHK email"
                class="form-control"
                [class.is-invalid]="loginForm.get('email')?.invalid && loginForm.get('email')?.touched"
              >
              <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['required'] && loginForm.get('email')?.touched">
                Email is required
              </div>
              <div class="invalid-feedback" *ngIf="loginForm.get('email')?.errors?.['email'] && loginForm.get('email')?.touched">
                Please enter a valid email
              </div>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <div class="password-field">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password" 
                  placeholder="Your password"
                  class="form-control"
                  [class.is-invalid]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                >
                <button type="button" class="toggle-password" (click)="togglePassword()">
                  <i class="fa" [class.fa-eye]="!showPassword" [class.fa-eye-slash]="showPassword"></i>
                </button>
              </div>
              <div class="invalid-feedback" *ngIf="loginForm.get('password')?.errors?.['required'] && loginForm.get('password')?.touched">
                Password is required
              </div>
            </div>
            
            <div class="error-message" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary" [disabled]="loginForm.invalid || isSubmitting">
                {{ isSubmitting ? 'Signing in...' : 'Sign In' }}
              </button>
              <div class="forgot-password">
                <a routerLink="/auth/forgot-password">Forgot Password?</a>
              </div>
            </div>
            
            <div class="register-prompt">
              <p>Don't have an account? <a routerLink="/auth/register">Sign Up</a></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 80px);
      padding: 30px 15px;
      background-color: #f8f9fa;
    }
    
    .login-card {
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
      width: 100%;
      max-width: 450px;
      padding: 40px 30px;
    }
    
    .login-icon {
      font-size: 64px;
      color: #4f7cac;
      text-align: center;
      margin-bottom: 30px;
    }
    
    .login-content h2 {
      color: #343a40;
      font-size: 1.8rem;
      margin-bottom: 10px;
      text-align: center;
    }
    
    .login-content p {
      color: #6c757d;
      margin-bottom: 30px;
      text-align: center;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #495057;
    }
    
    .form-control {
      width: 100%;
      padding: 12px 15px;
      font-size: 16px;
      border: 1px solid #ced4da;
      border-radius: 8px;
      transition: border-color 0.3s;
    }
    
    .form-control:focus {
      outline: none;
      border-color: #4f7cac;
      box-shadow: 0 0 0 3px rgba(79, 124, 172, 0.1);
    }
    
    .form-control.is-invalid {
      border-color: #dc3545;
    }
    
    .invalid-feedback {
      color: #dc3545;
      font-size: 0.85rem;
      margin-top: 5px;
    }
    
    .password-field {
      position: relative;
    }
    
    .toggle-password {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #6c757d;
      cursor: pointer;
    }
    
    .error-message {
      background-color: #f8d7da;
      color: #dc3545;
      padding: 10px 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9rem;
    }
    
    .form-actions {
      margin-top: 30px;
    }
    
    .btn-primary {
      width: 100%;
      padding: 12px;
      background-color: #4f7cac;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    
    .btn-primary:hover {
      background-color: #3a5d82;
    }
    
    .btn-primary:disabled {
      background-color: #a8c4e5;
      cursor: not-allowed;
    }
    
    .forgot-password {
      text-align: center;
      margin-top: 15px;
    }
    
    .forgot-password a {
      color: #6c757d;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.3s;
    }
    
    .forgot-password a:hover {
      color: #4f7cac;
      text-decoration: underline;
    }
    
    .register-prompt {
      margin-top: 30px;
      text-align: center;
      font-size: 0.9rem;
      color: #6c757d;
    }
    
    .register-prompt a {
      color: #4f7cac;
      font-weight: 600;
      text-decoration: none;
      transition: color 0.3s;
    }
    
    .register-prompt a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    
    // Auto-fill for demo purposes
    this.loginForm.setValue({
      email: 'user@link.cuhk.edu.hk',
      password: 'User123'
    });
  }

  initializeForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        // Check if the user's email is verified
        const currentUser = this.authService.getCurrentUser();
        if (currentUser && !currentUser.isEmailVerified) {
          // Redirect to email verification page
          this.router.navigate(['/auth/verify-email']);
        } else {
          // Redirect to match dashboard
          this.router.navigate(['/match']);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}