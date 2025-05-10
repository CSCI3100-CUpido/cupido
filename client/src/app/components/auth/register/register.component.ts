import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { finalize, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  
  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  
  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required, 
        Validators.pattern('\\S+@(link\\.cuhk\\.edu\\.hk|cuhk\\.edu\\.hk)$')
      ], [this.validateEmailNotTaken()]],
      gender: ['male'],
      dateOfBirth: ['', [Validators.required, this.validateAge(18)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        this.hasNumber(),
        this.hasCapitalCase()
      ]],
      confirmPassword: ['', Validators.required],
      agreeTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }
  
  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }
  
  hasNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const hasNumber = /\d/.test(value);
      
      return hasNumber ? null : { hasNumber: true };
    };
  }
  
  hasCapitalCase(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      const hasUpperCase = /[A-Z]/.test(value);
      
      return hasUpperCase ? null : { hasCapitalCase: true };
    };
  }
  
  validateAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const today = new Date();
      const birthDate = new Date(control.value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      return age >= minAge ? null : { underAge: true };
    };
  }
  
  validateEmailNotTaken() {
    return (control: AbstractControl) => {
      return this.authService.checkEmailExists(control.value).pipe(
        finalize(() => {}),
        map((exists: boolean) => (exists ? { emailExists: true } : null))
      );
    };
  }
  
  register(): void {
    if (this.registerForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    const values = this.registerForm.value;
    const registerModel = {
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender
    };
    
    this.authService.register(registerModel).subscribe({
      next: () => {
        // Success message would normally be handled by ToastrService
        console.log('Registration successful! Please check your email to verify your account.');
        this.router.navigateByUrl('/verify-email');
      },
      error: (error) => {
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  openTermsModal(event: Event): void {
    event.preventDefault();
    // Implement terms modal opening logic
    // For example: this.modalService.open('terms-modal');
  }
  
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get dateOfBirth() { return this.registerForm.get('dateOfBirth'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
}