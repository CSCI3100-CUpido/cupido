// src/app/services/mock-verification.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators'; 
import { AuthService } from './auth.service';

export interface VerificationRequest {
  email: string;
  code?: string;
  isVerified?: boolean;
  createdAt: Date;
  expiresAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class MockVerificationService {
  // 储存验证请求的映射
  private verificationRequests: Map<string, VerificationRequest> = new Map();
  // 模拟验证码 - 所有用户都使用同一个代码便于测试：123456
  private defaultVerificationCode: string = '123456';
  
  constructor(private authService: AuthService) {}
  
  /**
   * 发送验证码到用户邮箱
   * @param email 用户邮箱
   * @returns Observable of success
   */
  sendVerificationCode(email: string): Observable<{ success: boolean }> {
    // 获取当前用户
    const currentUser = this.authService.getCurrentUser();
    
    // 如果没有登录用户，返回错误
    if (!currentUser && !email) {
      return throwError(() => new Error('User not authenticated')).pipe(delay(500));
    }
    
    // 使用传入的email或当前用户的email
    const userEmail = email || currentUser?.email || '';
    
    // 存储验证请求，有效期30分钟
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 30 * 60000); // 30分钟
    
    this.verificationRequests.set(userEmail, {
      email: userEmail,
      code: this.defaultVerificationCode,
      isVerified: false,
      createdAt: now,
      expiresAt
    });
    
    // 在控制台显示验证码（模拟）
    console.log(`Verification code for ${userEmail}: ${this.defaultVerificationCode}`);
    
    return of({ success: true }).pipe(delay(1000));
  }
  
  /**
   * 验证用户输入的验证码
   * @param email 用户邮箱
   * @param code 验证码
   * @returns Observable of verification result
   */
  verifyCode(email: string, code: string): Observable<{ success: boolean, message: string }> {
    // 获取当前用户
    const currentUser = this.authService.getCurrentUser();
    
    // 如果没有登录用户，返回错误
    if (!currentUser && !email) {
      return throwError(() => new Error('User not authenticated')).pipe(delay(500));
    }
    
    // 使用传入的email或当前用户的email
    const userEmail = email || currentUser?.email || '';
    
    // 获取请求
    const request = this.verificationRequests.get(userEmail);
    
    // 如果请求不存在，使用默认验证码
    if (!request) {
      // 检查是否是默认验证码
      if (code === this.defaultVerificationCode) {
        // 如果是当前用户，更新验证状态
        if (currentUser) {
          currentUser.isEmailVerified = true;
          this.authService.setCurrentUser(currentUser);
        }
        
        return of({ 
          success: true, 
          message: 'Email verified successfully!' 
        }).pipe(delay(500));
      } else {
        return throwError(() => new Error('Invalid verification code. Please try again.')).pipe(delay(500));
      }
    }
    
    // 检查过期
    if (new Date() > request.expiresAt) {
      return throwError(() => new Error('Verification code expired. Please request a new code.')).pipe(delay(500));
    }
    
    // 检查验证码
    if (request.code !== code && code !== this.defaultVerificationCode) {
      return throwError(() => new Error('Invalid verification code. Please try again.')).pipe(delay(500));
    }
    
    // 标记为已验证
    request.isVerified = true;
    this.verificationRequests.set(userEmail, request);
    
    // 如果是当前用户，更新验证状态
    if (currentUser && currentUser.email === userEmail) {
      currentUser.isEmailVerified = true;
      this.authService.setCurrentUser(currentUser);
    }
    
    return of({ 
      success: true, 
      message: 'Email verified successfully!' 
    }).pipe(delay(500));
  }
  
  /**
   * 检查邮箱是否已验证
   * @param email 用户邮箱
   * @returns Observable of verification status
   */
  isEmailVerified(email: string): Observable<boolean> {
    // 获取当前用户
    const currentUser = this.authService.getCurrentUser();
    
    // 如果没有登录用户，返回false
    if (!currentUser && !email) {
      return of(false).pipe(delay(300));
    }
    
    // 使用传入的email或当前用户的email
    const userEmail = email || currentUser?.email || '';
    
    // 获取请求
    const request = this.verificationRequests.get(userEmail);
    
    // 如果请求不存在，检查当前用户的验证状态
    if (!request && currentUser) {
      return of(currentUser.isEmailVerified === true).pipe(delay(300));
    } else if (!request) {
      return of(false).pipe(delay(300));
    }
    
    return of(request.isVerified === true).pipe(delay(300));
  }
  
  /**
   * 重置验证状态（用于测试）
   * @param email 用户邮箱
   */
  resetVerification(email: string): void {
    this.verificationRequests.delete(email);
  }
  
  // 适配 VerificationService 接口的方法
  
  /**
   * 重新发送验证邮件
   * @returns Observable<void>
   */
  resendVerificationCode(): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated')).pipe(delay(500));
    }
    
    return this.sendVerificationCode(currentUser.email).pipe(
      delay(300),
      map(() => undefined)
    );
  }
  
  /**
   * 验证邮箱
   * @param token 验证码
   * @returns Observable<void>
   */
  verifyEmail(token: string): Observable<void> {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      return throwError(() => new Error('User not authenticated')).pipe(delay(500));
    }
    
    return this.verifyCode(currentUser.email, token).pipe(
      delay(300),
      map(() => undefined)
    );
  }
}