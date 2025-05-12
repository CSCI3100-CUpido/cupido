// src/app/components/auth/auth.routes.ts
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { VerificationCodeComponent } from './verification-code/verification-code.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'verification-code', component: VerificationCodeComponent },
  // Redirect to login by default
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];