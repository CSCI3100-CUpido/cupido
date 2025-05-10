import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { MockAuthService } from '../../../services/mock-auth.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  returnUrl: string = '/';
  isSubmitting = false;
  showPassword = false;
  loginError: string | null = null;
  demoMode = environment.demoMode;

  constructor(
    private authService: AuthService,
    private mockAuthService: MockAuthService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Create login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Get return URL from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.loginError = null;

    // Use mock or real service based on demo mode
    const service = this.demoMode ? this.mockAuthService : this.authService;

    service.login(this.loginForm.value).subscribe({
      next: (user) => {
        // When using mock service in demo mode, we need to set the user in authService
        if (this.demoMode) {
          this.authService.setCurrentUser(user);
        }
        this.router.navigateByUrl(this.returnUrl);
      },
      error: error => {
        this.loginError = error.error || 'Invalid username or password';
        this.isSubmitting = false;
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Helper methods for demo mode
  fillAdminCredentials(): void {
    this.loginForm.setValue({
      email: 'admin@cuhk.edu.hk',
      password: 'Admin123'
    });
  }

  fillUserCredentials(): void {
    this.loginForm.setValue({
      email: 'user@link.cuhk.edu.hk',
      password: 'User123'
    });
  }
}