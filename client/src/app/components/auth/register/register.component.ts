// src/app/components/auth/register/register.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { VerificationService } from '../../../services/verification.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  returnUrl: string = '';
  hidePassword = true;
  minDate: string;
  maxDate: string;
  isSubmitting = false;
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private verificationService: VerificationService,
    private navigationService: NavigationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // 设置日期范围：18-60岁
    const today = new Date();
    const eighteenYearsAgo = new Date(today);
    eighteenYearsAgo.setFullYear(today.getFullYear() - 18);
    const sixtyYearsAgo = new Date(today);
    sixtyYearsAgo.setFullYear(today.getFullYear() - 60);

    this.minDate = this.formatDate(sixtyYearsAgo);
    this.maxDate = this.formatDate(eighteenYearsAgo);
  }

  // Getters for form controls to use in the template
  get username() { return this.registerForm.get('username'); }
  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get confirmPassword() { return this.registerForm.get('confirmPassword'); }
  get dateOfBirth() { return this.registerForm.get('dateOfBirth'); }
  get gender() { return this.registerForm.get('gender'); }
  get termsAccepted() { return this.registerForm.get('termsAccepted'); }
  get showPassword() { return !this.hidePassword; }

  ngOnInit(): void {
    // 获取返回URL（如果存在）
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '';
    });

    this.initializeForm();
  }

  initializeForm(): void {
    this.registerForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern('.*@(link\\.cuhk\\.edu\\.hk|cuhk\\.edu\\.hk)$')
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$')
      ]],
      confirmPassword: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      termsAccepted: [false, Validators.requiredTrue]
    }, {
      validators: this.passwordMatchValidator
    });

    // 添加表单变更监听，打印出表单状态，帮助调试
    this.registerForm.valueChanges.subscribe(() => {
      console.log('Form valid:', this.registerForm.valid);
      console.log('Form errors:', this.registerForm.errors);
      console.log('Invalid controls:',
        Object.keys(this.registerForm.controls)
          .filter(key => this.registerForm.controls[key].invalid)
          .map(key => ({ key, errors: this.registerForm.controls[key].errors }))
      );
    });
  }

  // 密码匹配验证器
  passwordMatchValidator(g: FormGroup) {
    const password = g.get('password')?.value;
    const confirmPassword = g.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      return null;
    }
    
    return { 'mismatch': true };
  }

  // 日期格式化
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  register(): void {
    // 标记表单为已提交，即使表单无效也显示所有验证错误
    this.formSubmitted = true;
    
    if (this.registerForm.invalid) {
      // 标记所有字段为触摸状态以显示验证错误
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      
      // 添加详细日志，帮助调试
      console.log('Form is invalid:', this.registerForm.errors);
      console.log('Form values:', this.registerForm.value);
      console.log('Form controls status:', 
        Object.keys(this.registerForm.controls).reduce((acc, key) => {
          acc[key] = { 
            valid: this.registerForm.controls[key].valid, 
            errors: this.registerForm.controls[key].errors 
          };
          return acc;
        }, {} as any)
      );
      
      // 显示表单无效的错误消息
      this.errorMessage = 'Please correct the errors in the form before submitting.';
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.successMessage = 'Registration successful! Redirecting to verification...';
        
        // 启动验证流程
        this.navigationService.startAuthFlow(this.registerForm.value.email);
        
        // 自动发送验证码
        this.verificationService.sendVerificationCode(this.registerForm.value.email).subscribe({
          next: () => {
            // 导航到验证页面
            setTimeout(() => {
              this.navigationService.navigateToVerification();
            }, 1000);
          },
          error: (error) => {
            console.error('Error sending verification code', error);
            // 即使发送验证码失败也导航到验证页面
            setTimeout(() => {
              this.navigationService.navigateToVerification();
            }, 1000);
          }
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('Registration error:', error);
      }
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  openTermsModal(event: Event): void {
    event.preventDefault();
    // 这里可以打开条款和条件的模态框
    alert('Terms and conditions dialog would open here');
  }
}