// src/app/services/mock-auth.service.ts
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
    interests: ['Technology', 'Dating Apps', 'Administration', 'Fitness', 'Travel', 'Reading'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Administrator of Cupido Dating App. Computer science major with a passion for creating meaningful connections through technology.',
    isEmailVerified: true,
    roles: ['Admin', 'User']
  };

  // Regular user for demonstration
  private normalUser: User = {
    id: '2',
    username: 'User',
    email: 'user@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyIiwibmFtZSI6IlVzZXIiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgo',
    photoUrl: 'assets/images/avatar-1.jpg',
    dateOfBirth: new Date('1995-05-15'),
    created: new Date('2023-02-15'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Music', 'Sports', 'Reading', 'Movies', 'Photography', 'Dancing'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Regular user of Cupido Dating App. Business administration major who loves outdoor activities and listening to music. Looking for meaningful connections on campus.',
    isEmailVerified: true,
    roles: ['User']
  };

  // Additional users for demonstration
  private jennyUser: User = {
    id: '3',
    username: 'Jenny',
    email: 'jenny@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIzIiwibmFtZSI6Ikplbm55IiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiVXNlciJ9.8HECib3S4KQ9XE3snHZoAub5A9S-k8_OZNL-9PJCJxy',
    photoUrl: 'assets/images/avatar-2.jpg',
    dateOfBirth: new Date('1996-08-22'),
    created: new Date('2023-01-15'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Literature', 'Arts', 'Travel', 'Languages', 'Writing', 'Fashion'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Exchange student from Taiwan. Love literature and arts, hoping to make more friends in Hong Kong. I enjoy writing poetry and exploring new cultures.',
    isEmailVerified: true,
    roles: ['User']
  };

  private michaelUser: User = {
    id: '4',
    username: 'Michael',
    email: 'michael@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0IiwibmFtZSI6Ik1pY2hhZWwiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgp',
    photoUrl: 'assets/images/avatar-3.jpg',
    dateOfBirth: new Date('1994-03-10'),
    created: new Date('2023-02-01'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Basketball', 'Swimming', 'Marketing', 'Social Media', 'Hiking', 'Technology'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Sports enthusiast, especially basketball and swimming. Love making new friends and participating in campus activities. Marketing major with a passion for digital media.',
    isEmailVerified: true,
    roles: ['User']
  };

  private sophieUser: User = {
    id: '5',
    username: 'Sophie',
    email: 'sophie@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1IiwibmFtZSI6IlNvcGhpZSIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6IlVzZXIifQ.8HECib3S4KQ9XE3snHZoAub5A9S-k8_OZNL-9PJCJxz',
    photoUrl: 'assets/images/avatar-4.jpg',
    dateOfBirth: new Date('1997-11-05'),
    created: new Date('2023-01-20'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Hiking', 'Biology', 'Photography', 'Environmental Protection', 'Cooking', 'Art'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Biology major who loves natural sciences. I often go hiking around Hong Kong on weekends. Looking for friends to explore nature together. Passionate about environmental conservation.',
    isEmailVerified: true,
    roles: ['User']
  };

  private davidUser: User = {
    id: '6',
    username: 'David',
    email: 'david@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6IkRhdmlkIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiVXNlciJ9.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgt',
    photoUrl: 'assets/images/avatar-5.jpg',
    dateOfBirth: new Date('1995-07-18'),
    created: new Date('2023-02-05'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Physics', 'Music', 'Guitar', 'Astronomy', 'Programming', 'Gaming'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Physics major fascinated by the universe. I also play guitar and write songs in my free time. Looking for like-minded friends who enjoy music and science.',
    isEmailVerified: true,
    roles: ['User']
  };

  // Additional Users
  private lilyUser: User = {
    id: '7',
    username: 'Lily',
    email: 'lily@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI3IiwibmFtZSI6IkxpbHkiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgu',
    photoUrl: 'assets/images/avatar-6.jpg',
    dateOfBirth: new Date('1998-04-12'),
    created: new Date('2023-02-10'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Dancing', 'Fashion', 'Music', 'Photography', 'Travel', 'Art'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Dance major who loves choreography and fashion. I enjoy capturing beautiful moments through photography and exploring different cultures through travel.',
    isEmailVerified: true,
    roles: ['User']
  };

  private alexUser: User = {
    id: '8',
    username: 'Alex',
    email: 'alex@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4IiwibmFtZSI6IkFsZXgiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgh',
    photoUrl: 'assets/images/avatar-7.jpg',
    dateOfBirth: new Date('1996-09-25'),
    created: new Date('2023-01-28'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Programming', 'Gaming', 'Technology', 'Anime', 'Music', 'Foodie'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Computer science student with a passion for game development. Love exploring new tech, watching anime, and trying different cuisines around Hong Kong.',
    isEmailVerified: true,
    roles: ['User']
  };

  private rachelUser: User = {
    id: '9',
    username: 'Rachel',
    email: 'rachel@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5IiwibmFtZSI6IlJhY2hlbCIsImlhdCI6MTUxNjIzOTAyMiwicm9sZSI6IlVzZXIifQ.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgi',
    photoUrl: 'assets/images/avatar-8.jpg',
    dateOfBirth: new Date('1997-03-15'),
    created: new Date('2023-01-05'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Psychology', 'Reading', 'Yoga', 'Meditation', 'Art Therapy', 'Nature'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Psychology major interested in mental health and wellness. I enjoy yoga, meditation, and exploring how art can be therapeutic. Looking for thoughtful conversations.',
    isEmailVerified: true,
    roles: ['User']
  };

  private danielUser: User = {
    id: '10',
    username: 'Daniel',
    email: 'daniel@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMCIsIm5hbWUiOiJEYW5pZWwiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgj',
    photoUrl: 'assets/images/avatar-9.jpg',
    dateOfBirth: new Date('1995-11-20'),
    created: new Date('2023-01-10'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Economics', 'Finance', 'Basketball', 'Cooking', 'Travel', 'Coffee'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Economics major with a passion for finance and investments. I play basketball to stay active and enjoy cooking international cuisines. Coffee enthusiast and avid traveler.',
    isEmailVerified: true,
    roles: ['User']
  };

  private oliviaUser: User = {
    id: '11',
    username: 'Olivia',
    email: 'olivia@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMSIsIm5hbWUiOiJPbGl2aWEiLCJpYXQiOjE1MTYyMzkwMjIsInJvbGUiOiJVc2VyIn0.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgk',
    photoUrl: 'assets/images/avatar-10.jpg',
    dateOfBirth: new Date('1998-08-05'),
    created: new Date('2023-02-08'),
    lastActive: new Date(),
    gender: 'female',
    interests: ['Marketing', 'Social Media', 'Photography', 'Fashion', 'Blogging', 'Travel'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Marketing student and social media enthusiast. I love creating content, taking photos, and following fashion trends. Looking to connect with creative individuals.',
    isEmailVerified: true,
    roles: ['User']
  };

  private williamUser: User = {
    id: '12',
    username: 'William',
    email: 'william@link.cuhk.edu.hk',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMiIsIm5hbWUiOiJXaWxsaWFtIiwiaWF0IjoxNTE2MjM5MDIyLCJyb2xlIjoiVXNlciJ9.gZzrkkTm_qfzGvrMT82UBQwUo8NJ-qyGpLSBW1Wcsgl',
    photoUrl: 'assets/images/avatar-11.jpg',
    dateOfBirth: new Date('1996-12-18'),
    created: new Date('2023-01-25'),
    lastActive: new Date(),
    gender: 'male',
    interests: ['Engineering', 'Robotics', 'Hiking', 'Photography', 'Drones', 'Technology'],
    city: 'Hong Kong',
    country: 'China',
    bio: 'Engineering student with a focus on robotics. I enjoy hiking and capturing aerial photography with my drone. Looking for outdoor adventure companions.',
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
    this.davidUser,
    this.lilyUser,
    this.alexUser,
    this.rachelUser,
    this.danielUser,
    this.oliviaUser,
    this.williamUser
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
    
    // Check if email is a CUHK email
    if (!this.isCUHKEmail(model.email)) {
      return throwError(() => new Error('Only CUHK email addresses are allowed')).pipe(delay(500));
    }

    // Create new user with default values
    const newUser: User = {
      id: (this.users.length + 1).toString(),
      username: model.username,
      email: model.email,
      token: `mock-jwt-token-${Date.now()}`,
      photoUrl: 'assets/images/avatar-default.jpg',
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
    // For demo, any token works to verify the email
    const currentUser = this.getCurrentUser();
    
    if (currentUser && !currentUser.isEmailVerified) {
      // Find user in users array
      const userIndex = this.users.findIndex(u => u.id === currentUser.id);
      
      if (userIndex !== -1) {
        // Update isEmailVerified flag
        this.users[userIndex].isEmailVerified = true;
        
        // Update current user
        const updatedUser = {...this.users[userIndex]};
        this.setCurrentUser(updatedUser);
      }
    }
    
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
    
    // For demo purposes, return all users regardless of admin status
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
  
  /**
   * Update user profile
   * @param updates User profile updates
   * @returns Observable of updated User
   */
  updateUserProfile(updates: Partial<User>): Observable<User> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not logged in')).pipe(delay(300));
    }
    
    // Find user in the users array
    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex === -1) {
      return throwError(() => new Error('User not found')).pipe(delay(300));
    }
    
    // Update user in the users array
    const updatedUser: User = {
      ...this.users[userIndex],
      ...updates,
      lastActive: new Date()
    };
    
    this.users[userIndex] = updatedUser;
    
    // Update current user if this is the current user's profile
    if (currentUser.id === updatedUser.id) {
      this.setCurrentUser(updatedUser);
    }
    
    return of(updatedUser).pipe(delay(500));
  }
  
  /**
   * Update user password
   * @param currentPassword Current password
   * @param newPassword New password
   * @returns Observable of success message
   */
  updatePassword(currentPassword: string, newPassword: string): Observable<string> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not logged in')).pipe(delay(300));
    }
    
    // For demo purposes, current password is username + "123"
    const expectedPassword = currentUser.username + "123";
    
    if (currentPassword !== expectedPassword) {
      return throwError(() => new Error('Current password is incorrect')).pipe(delay(300));
    }
    
    // In a real app, you would hash the password before storing it
    // For this demo, we'll just return a success message
    return of('Password updated successfully').pipe(delay(500));
  }
  
  /**
   * Delete user account
   * @param password Password for confirmation
   * @returns Observable of success message
   */
  deleteAccount(password: string): Observable<string> {
    const currentUser = this.getCurrentUser();
    
    if (!currentUser) {
      return throwError(() => new Error('Not logged in')).pipe(delay(300));
    }
    
    // For demo purposes, password is username + "123"
    const expectedPassword = currentUser.username + "123";
    
    if (password !== expectedPassword) {
      return throwError(() => new Error('Password is incorrect')).pipe(delay(300));
    }
    
    // Find user in the users array
    const userIndex = this.users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
      // Remove user from the users array
      this.users.splice(userIndex, 1);
    }
    
    // Logout
    this.logout();
    
    return of('Account deleted successfully').pipe(delay(500));
  }
}