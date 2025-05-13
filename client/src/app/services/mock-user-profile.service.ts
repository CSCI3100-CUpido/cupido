// src/app/services/mock-user-profile.service.ts
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User } from './auth.service';
import { MockAuthService } from './mock-auth.service';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  photoUrl?: string;
  dateOfBirth?: Date;
  gender?: string;
  interests?: string[];
  city?: string;
  country?: string;
  bio?: string;
  isEmailVerified: boolean;
  isProfileComplete: boolean;
  campus?: string;
  department?: string;
  graduationYear?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockUserProfileService {
  // In-memory storage for mock
  private userProfiles: Map<string, UserProfile> = new Map();

  constructor(private mockAuthService: MockAuthService) {
    this.initializeMockData();
  }

  private initializeMockData(): void {
    this.mockAuthService.getAllUsers().subscribe({
      next: (users) => {
        users.forEach(user => {
          // Create profile for each user
          const profile: UserProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            photoUrl: user.photoUrl,
            dateOfBirth: user.dateOfBirth,
            gender: user.gender,
            interests: user.interests,
            city: user.city,
            country: user.country,
            bio: user.bio,
            isEmailVerified: user.isEmailVerified,
            isProfileComplete: this.calculateProfileCompletion(user),
            campus: 'CUHK', // Default for mock
            department: this.getRandomDepartment(),
            graduationYear: 2023 + Math.floor(Math.random() * 4) // Random graduation year
          };
          
          this.userProfiles.set(user.id, profile);
        });
      },
      error: (error) => {
        console.error('Error initializing mock user profiles', error);
      }
    });
  }
  
  /**
   * Calculate profile completion percentage
   */
  private calculateProfileCompletion(user: User): boolean {
    // Check if all required fields are filled
    const requiredFields = [
      user.username,
      user.email,
      user.photoUrl,
      user.dateOfBirth,
      user.gender,
      user.bio,
      user.city
    ];
    
    // 修复类型错误，使用空值合并运算符确保返回布尔值
    const hasInterests = (user.interests?.length ?? 0) >= 3;
    
    return !requiredFields.some(field => !field) && hasInterests;
  }
  
  /**
   * Get random department for mock data
   */
  private getRandomDepartment(): string {
    const departments = [
      'Computer Science',
      'Business Administration',
      'Engineering',
      'Social Sciences',
      'Medicine',
      'Law',
      'Arts',
      'Education',
      'Science'
    ];
    
    return departments[Math.floor(Math.random() * departments.length)];
  }
  
  /**
   * Get user profile by ID
   */
  getUserProfile(userId: string): Observable<UserProfile> {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      // 如果没有找到用户资料，创建一个新的基于当前用户
      return this.mockAuthService.getUserById(userId).pipe(
        map(user => {
          // 创建默认配置文件
          const newProfile: UserProfile = {
            id: user.id,
            username: user.username,
            email: user.email,
            photoUrl: user.photoUrl || 'assets/images/avatar-default.jpg',
            dateOfBirth: user.dateOfBirth || new Date(),
            gender: user.gender || '',
            interests: user.interests || [],
            city: user.city || 'Hong Kong',
            country: user.country || 'China',
            bio: user.bio || '',
            isEmailVerified: user.isEmailVerified || false,
            isProfileComplete: false,
            campus: 'CUHK',
            department: this.getRandomDepartment(),
            graduationYear: 2023 + Math.floor(Math.random() * 4)
          };
          
          // 保存到内存中
          this.userProfiles.set(userId, newProfile);
          return newProfile;
        }),
        // 添加延迟使其看起来像网络请求
        delay(300)
      );
    }
    
    return of(profile).pipe(delay(300));
  }
  
  /**
   * Update user profile
   */
  updateUserProfile(userId: string, profile: Partial<UserProfile>): Observable<UserProfile> {
    console.log('Updating profile for user:', userId, profile);

    // 获取现有的资料或创建一个新的
    let existingProfile = this.userProfiles.get(userId);
    
    if (!existingProfile) {
      // 如果没有现有的资料，创建一个基本的
      existingProfile = {
        id: userId,
        username: profile.username || 'New User',
        email: profile.email || '',
        isEmailVerified: false,
        isProfileComplete: false
      };
    }
    
    // 更新资料
    const updatedProfile = {
      ...existingProfile,
      ...profile,
      // 重新计算资料完成状态
      isProfileComplete: this.calculateProfileCompletionFromProfile({
        ...existingProfile,
        ...profile
      })
    };
    
    // 保存更新后的资料
    this.userProfiles.set(userId, updatedProfile);
    
    // 同时更新认证服务中的用户对象
    this.mockAuthService.updateUserProfile(profile as Partial<User>).subscribe({
      next: (user) => {
        console.log('User updated in auth service:', user);
      },
      error: (error) => {
        console.error('Error updating user in auth service:', error);
      }
    });
    
    return of(updatedProfile).pipe(delay(500));
  }
  
  private calculateProfileCompletionFromProfile(profile: UserProfile): boolean {
    // 检查所有必填字段是否已填写
    const requiredFields = [
      profile.username,
      profile.email,
      profile.photoUrl,
      profile.dateOfBirth,
      profile.gender,
      profile.bio,
      profile.city
    ];
    
    // 修复类型错误，使用空值合并运算符确保返回布尔值
    const hasInterests = (profile.interests?.length ?? 0) >= 3;
    
    return !requiredFields.some(field => !field) && hasInterests;
  }
  
  /**
   * Check if profile is complete
   */
  isProfileComplete(userId: string): Observable<boolean> {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return of(false).pipe(delay(300));
    }
    
    return of(profile.isProfileComplete).pipe(delay(300));
  }
  
  /**
   * Get profile completion steps
   */
  getProfileCompletionSteps(userId: string): Observable<string[]> {
    const profile = this.userProfiles.get(userId);
    
    if (!profile) {
      return of([
        'Upload a profile photo',
        'Add your birthday',
        'Select your gender',
        'Write a bio',
        'Add your location',
        'Select at least 3 interests'
      ]).pipe(delay(300));
    }
    
    const steps: string[] = [];
    
    if (!profile.photoUrl) {
      steps.push('Upload a profile photo');
    }
    
    if (!profile.dateOfBirth) {
      steps.push('Add your birthday');
    }
    
    if (!profile.gender) {
      steps.push('Select your gender');
    }
    
    if (!profile.bio) {
      steps.push('Write a bio');
    }
    
    if (!profile.city) {
      steps.push('Add your location');
    }
    
    if (!profile.interests || profile.interests.length < 3) {
      steps.push('Select at least 3 interests');
    }
    
    return of(steps).pipe(delay(300));
  }
}