import { Injectable } from '@angular/core';
import { Observable, of, throwError, ReplaySubject } from 'rxjs';
import { delay } from 'rxjs/operators';
import { User, UserLogin, UserRegister } from './auth.service';

/**
 * Mock Authentication Service - For demonstration purposes only
 * This service simulates backend authentication behavior
 */
@Injectable({
  providedIn: 'root'
})
export class MockAuthService {
  private currentUserSource = new ReplaySubject<User | null>(1);
  currentUser$ = this.currentUserSource.asObservable();
  
  // Admin user for demonstration
  private adminUser: User = {
    id: '1',
    username: 'Admin',
    email: 'admin@cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwibmFtZSI6IkFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjpbIkFkbWluIiwiVXNlciJdfQ.8HECib3S4KQ9XE3snHZoAub5A9S-k8_OZNL-9PJCJxw',
    photoUrl: 'assets/images/admin-avatar.png',
    dateOfBirth: new Date('1990-01-01'),
    created: new Date('2023-01-01'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Technology', 'Dating Apps', 'Administration'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Administrator of Cupido Dating App',
    isEmailVerified: true,
    roles: ['Admin', 'User']
  };

  // Regular user for demonstration
  private normalUser: User = {
    id: '2',
    username: 'User',
    email: 'user@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgo',
    photoUrl: 'assets/images/default-avatar.png',
    dateOfBirth: new Date('1995-05-15'),
    created: new Date('2023-02-15'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Music', 'Sports', 'Reading'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Regular user of Cupido Dating App',
    isEmailVerified: true,
    roles: ['User']
  };

  // Additional users for demonstration
  private jennyUser: User = {
    id: '3',
    username: 'Jenny',
    email: 'jenny@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6Ikplbm55IiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiVXNlciJ9.8HECib3S4KQ9XE3snHZoAub5A9S-k8_OZNL-9PJCJxy',
    photoUrl: 'assets/images/user3-avatar.png',
    dateOfBirth: new Date('1996-08-22'),
    created: new Date('2023-01-15'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Literature', 'Arts', 'Travel', 'Languages'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Exchange student from Taiwan. Love literature and arts, hoping to make more friends in Hong Kong.',
    isEmailVerified: true,
    roles: ['User']
  };

  private michaelUser: User = {
    id: '4',
    username: 'Michael',
    email: 'michael@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6Ik1pY2hhZWwiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgp',
    photoUrl: 'assets/images/user4-avatar.png',
    dateOfBirth: new Date('1994-03-10'),
    created: new Date('2023-02-01'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Basketball', 'Swimming', 'Marketing', 'Social Media'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Sports enthusiast, especially basketball and swimming. Love making new friends and participating in campus activities.',
    isEmailVerified: true,
    roles: ['User']
  };

  private sophieUser: User = {
    id: '5',
    username: 'Sophie',
    email: 'sophie@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwibmFtZSI6IlNvcGhpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6IlVzZXIifQ.8HECib3S4KQ9XE3snHZoAub5A9S-k8_OZNL-9PJCJxz',
    photoUrl: 'assets/images/user5-avatar.png',
    dateOfBirth: new Date('1997-11-05'),
    created: new Date('2023-01-20'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Hiking', 'Biology', 'Photography', 'Environmental Protection'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Biology major who loves natural sciences. I often go hiking around Hong Kong on weekends. Looking for friends to explore nature together.',
    isEmailVerified: true,
    roles: ['User']
  };

  private davidUser: User = {
    id: '6',
    username: 'David',
    email: 'david@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6IkRhdmlkIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiVXNlciJ9.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgt',
    photoUrl: 'assets/images/user6-avatar.png',
    dateOfBirth: new Date('1995-07-18'),
    created: new Date('2023-02-05'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Physics', 'Music', 'Guitar', 'Astronomy'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Physics major fascinated by the universe. I also play guitar and write songs in my free time. Looking for like-minded friends.',
    isEmailVerified: true,
    roles: ['User']
  };

  // Store users for potential user management in the demo
  private users: User[] = [
    this.adminUser, 
    this.normalUser,
    this.jennyUser,
    this.michaelUser,
    this.sophieUser,
    this.davidUser
  ];
  
  constructor() {
    // Check for stored user on initialization
    if (typeof window !== 'undefined' && window.localStorage) {
      const userString = localStorage.getItem('user');
      if (userString) {
        try {
          const user = JSON.parse(userString);
          this.currentUserSource.next(user);
        } catch (error) {
          console.error('Error parsing user from localStorage', error);
          this.currentUserSource.next(null);
          localStorage.removeItem('user');
        }
      } else {
        this.currentUserSource.next(null);
      }
    }
  }

  /**
   * Mock login function
   * @param model Login credentials
   * @returns Observable of User if successful, error if failed
   */
  login(model: UserLogin): Observable<User> {
    // Find user by email
    const user = this.users.find(u => u.email === model.email);
    
    // For demo purposes, password is username + "123"
    const expectedPassword = user ? user.username + "123" : "";
    
    if (user && model.password === expectedPassword) {
      const updatedUser = {...user, lastActive: new Date()};
      this.setCurrentUser(updatedUser);
      return of(updatedUser).pipe(delay(500));
    } else {
      return throwError(() => new Error('Invalid credentials')).pipe(delay(500));
    }
  }

  /**
   * Mock register function
   * @param model Registration data
   * @returns Observable of User if successful, error if failed
   */
  register(model: UserRegister): Observable<User> {
    // Check if email already exists
    const existingUser = this.users.find(u => u.email === model.email);
    if (existingUser) {
      return throwError(() => new Error('Email already exists')).pipe(delay(500));
    }

    // Create new user with default values
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username: model.username,
      email: model.email,
      token: `mock-jwt-token-${Date.now()}`,
      photoUrl: 'assets/images/default-avatar.png',
      dateOfBirth: model.dateOfBirth ? new Date(model.dateOfBirth) : new Date(),
      created: new Date(),
      lastActive: new Date(),
      gender: model.gender || 'other',
      interests: [],
      city: 'Hong Kong',
      country: 'China',
      bio: '',
      isEmailVerified: false,
      roles: ['User']
    };

    // Add to users array
    this.users.push(newUser);
    
    // Set as current user
    this.setCurrentUser(newUser);

    // Return the new user
    return of(newUser).pipe(delay(500));
  }

  /**
   * Set current user
   * @param user User to set as current
   */
  setCurrentUser(user: User | null): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      if (user) {
        // Ensure roles property exists
        user.roles = user.roles || [];
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        localStorage.removeItem('user');
      }
    }
    this.currentUserSource.next(user);
  }

  /**
   * Get current user
   * @returns Current user or null if not logged in
   */
  getCurrentUser(): User | null {
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
    return null;
  }

  /**
   * Check if user is logged in
   * @returns true if user is logged in, false otherwise
   */
  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }

  /**
   * Logout current user
   */
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user');
    }
    this.currentUserSource.next(null);
  }

  /**
   * Get a decoded JWT token
   * @param token JWT token
   * @returns Decoded token object
   */
  getDecodedToken(token: string): any {
    const userTokenMap: { [key: string]: any } = {
      [this.adminUser.token as string]: { sub: '1', name: 'Admin', role: ['Admin', 'User'] },
      [this.normalUser.token as string]: { sub: '2', name: 'User', role: 'User' },
      [this.jennyUser.token as string]: { sub: '3', name: 'Jenny', role: 'User' },
      [this.michaelUser.token as string]: { sub: '4', name: 'Michael', role: 'User' },
      [this.sophieUser.token as string]: { sub: '5', name: 'Sophie', role: 'User' },
      [this.davidUser.token as string]: { sub: '6', name: 'David', role: 'User' }
    };
    
    // Return mapped token if exists
    if (token && userTokenMap[token]) {
      return userTokenMap[token];
    }
    
    // Try to decode token
    try {
      if (typeof window !== 'undefined') {
        return JSON.parse(atob(token.split('.')[1]));
      }
      return {};
    } catch {
      return {};
    }
  }

  /**
   * Check if email exists
   * @param email Email to check
   * @returns Observable boolean indicating if email exists
   */
  checkEmailExists(email: string): Observable<boolean> {
    const exists = this.users.some(u => u.email === email);
    return of(exists).pipe(delay(300));
  }

  /**
   * Resend verification email
   * @returns Observable void
   */
  resendVerificationEmail(): Observable<void> {
    // Mock successful operation
    return of(undefined).pipe(delay(500));
  }

  /**
   * Verify email with token
   * @param token Verification token
   * @returns Observable void
   */
  verifyEmail(token: string): Observable<void> {
    // Mock successful operation
    return of(undefined).pipe(delay(500));
  }

  /**
   * Handle forgot password request
   * @param email User email
   * @returns Observable void
   */
  forgotPassword(email: string): Observable<void> {
    // Check if email exists
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return throwError(() => new Error('Email not found')).pipe(delay(500));
    }
    
    // Mock successful operation
    return of(undefined).pipe(delay(500));
  }

  /**
   * Reset password with token
   * @param token Reset token
   * @param password New password
   * @returns Observable void
   */
  resetPassword(token: string, password: string): Observable<void> {
    // Mock successful operation
    return of(undefined).pipe(delay(500));
  }

  /**
   * Check if email is a CUHK email
   * @param email Email to check
   * @returns Boolean indicating if email is a CUHK email
   */
  isCUHKEmail(email: string): boolean {
    return email.endsWith('@link.cuhk.edu.hk') || email.endsWith('@cuhk.edu.hk');
  }
  
  /**
   * Get all users (Admin only)
   * @returns Observable of User[] if authorized, error if not
   */
  getAllUsers(): Observable<User[]> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser || !currentUser.roles?.includes('Admin')) {
      return throwError(() => new Error('Not authorized')).pipe(delay(500));
    }
    
    return of(this.users).pipe(delay(500));
  }
  
  /**
   * Get user by ID
   * @param userId User ID
   * @returns Observable of User if found, error if not
   */
  getUserById(userId: string): Observable<User> {
    const user = this.users.find(u => u.id === userId);
    
    if (!user) {
      return throwError(() => new Error('User not found')).pipe(delay(300));
    }
    
    return of(user).pipe(delay(300));
  }
}