// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface User {
  id: string;
  username: string;
  email: string;
  token?: string;
  photoUrl?: string;
  dateOfBirth?: Date;
  created?: Date;
  lastActive?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
  country?: string;
  bio?: string;
  isEmailVerified: boolean;
  roles?: string[];
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface UserRegister {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string | Date;
  gender?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/account`;
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { 
    // 初始化时检查localStorage中是否有用户
    const user = this.getCurrentUser();
    if (user) {
      this.setCurrentUser(user);
    }
  }

  login(model: UserLogin): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  register(model: UserRegister): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, model).pipe(
      map((response: User) => {
        const user = response;
        if (user) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }

  setCurrentUser(user: User | null): void {
    if (user) {
      user.roles = user.roles || [];
      const token = user.token;
      if (token) {
        const decodedToken = this.getDecodedToken(token);
        const roles = decodedToken.role;
        Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
      }
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
    this.currentUserSource.next(user);
  }

  getCurrentUser(): User | null {
    // 检查是否在浏览器环境中
    if (typeof window !== 'undefined' && window.localStorage) {
      const userString = localStorage.getItem('user');
      if (!userString) return null;
      
      try {
        return JSON.parse(userString);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        return null;
      }
    }
    return null; // 如果不在浏览器环境中，返回null
  }
  
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  }

  getDecodedToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (error) {
      console.error('Error decoding token', error);
      return {};
    }
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists?email=${email}`);
  }

  resendVerificationEmail(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/resend-verification`, {});
  }

  verifyEmail(token: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/verify-email`, { token });
  }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, password });
  }

  // Helper method to validate CUHK email format
  isCUHKEmail(email: string): boolean {
    return email.endsWith('@link.cuhk.edu.hk') || email.endsWith('@cuhk.edu.hk');
  }
  
  /**
   * Get all users (Admin only)
   * @returns Observable of User[]
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/admin/users`);
  }
  
  /**
   * Get user by ID
   * @param userId User ID
   * @returns Observable of User
   */
  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${userId}`);
  }
  
  /**
   * Update user profile
   * @param updates User updates
   * @returns Observable of User
   */
  updateUserProfile(updates: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, updates).pipe(
      map(user => {
        // Update current user if this is the current user's profile
        const currentUser = this.getCurrentUser();
        if (currentUser && currentUser.id === user.id) {
          this.setCurrentUser(user);
        }
        return user;
      })
    );
  }
  
  /**
   * Update user password
   * @param currentPassword Current password
   * @param newPassword New password
   * @returns Observable of string message
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/password`, { 
      currentPassword, 
      newPassword 
    });
  }
  
  /**
   * Delete user account
   * @param password Password for confirmation
   * @returns Observable of string message
   */
  deleteAccount(password: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/delete-account`, { password }).pipe(
      map(response => {
        this.logout();
        return response;
      })
    );
  }
}