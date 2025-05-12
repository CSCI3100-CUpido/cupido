// src/app/components/profile/profile.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { AuthService, User } from '../../services/auth.service';
import { UserProfileService, UserProfile } from '../../services/user-profile.service';
import { TimeagoPipe } from '../../pipes/timeago.pipe'; // 添加TimeagoPipe导入

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, TimeagoPipe], // 添加TimeagoPipe到imports
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any; // 添加此属性以匹配HTML模板
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  isEditing: boolean = false;
  isCurrentUser: boolean = true;
  viewMode: string = 'basic';
  profileForm!: FormGroup;
  allInterests: string[] = [
    'Music', 'Sports', 'Reading', 'Travel', 'Movies',
    'Food', 'Photography', 'Art', 'Technology', 'Gaming',
    'Fitness', 'Fashion', 'Nature', 'Languages', 'Science'
  ];
  
  currentUser: User | null = null;
  userProfile: UserProfile | null = null;
  userId: string = '';
  isOwnProfile: boolean = true;
  isProfileSetup: boolean = false;
  isProfileComplete: boolean = false;
  isSubmitting: boolean = false;
  completionSteps: string[] = [];
  isLiked: boolean = false;
  
  // 可用选项
  availableInterests: string[] = [
    'Music', 'Sports', 'Reading', 'Travel', 'Movies',
    'Food', 'Photography', 'Art', 'Technology', 'Gaming',
    'Fitness', 'Fashion', 'Nature', 'Languages', 'Science',
    'Politics', 'History', 'Business', 'Cooking', 'Philosophy'
  ];
  
  // 毕业年份选项
  graduationYears: number[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // 生成毕业年份（当前年份到当前年份+5）
    const currentYear = new Date().getFullYear();
    for (let i = 0; i <= 5; i++) {
      this.graduationYears.push(currentYear + i);
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    
    // 检查是否为个人资料设置
    this.isProfileSetup = this.router.url.includes('profile-setup');
    
    // 获取当前用户
    this.currentUser = this.authService.getCurrentUser();
    
    if (!this.currentUser) {
      this.router.navigate(['/auth/login']);
      return;
    }
    
    // 从路由参数获取用户ID或使用当前用户ID
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      
      if (userId) {
        // 查看他人的个人资料
        this.userId = userId;
        this.isOwnProfile = this.currentUser ? this.userId === this.currentUser.id : false;
        this.isCurrentUser = this.isOwnProfile;
      } else {
        // 查看/编辑自己的个人资料
        this.isOwnProfile = true;
        this.isCurrentUser = true;
        this.userId = this.currentUser?.id || '';
        
        // 如果是资料设置，启用编辑模式
        if (this.isProfileSetup) {
          this.isEditing = true;
        }
      }
      
      this.loadUserProfile();
    });
    
    // 初始化表单（HTML模板需要）
    this.initializeForm();
  }

  initializeForm(): void {
    this.profileForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: [''],
      gender: [''],
      city: [''],
      country: [''],
      bio: ['', Validators.maxLength(500)],
      interests: [[]]
    });
    
    if (this.userProfile) {
      this.profileForm.patchValue({
        username: this.userProfile.username,
        email: this.userProfile.email,
        dateOfBirth: this.formatDate(this.userProfile.dateOfBirth),
        gender: this.userProfile.gender || '',
        city: this.userProfile.city || '',
        country: this.userProfile.country || '',
        bio: this.userProfile.bio || '',
        interests: this.userProfile.interests || []
      });
    } else if (this.currentUser) {
      // 如果没有用户资料但有当前用户，填充基本信息
      this.profileForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email,
        dateOfBirth: this.formatDate(this.currentUser.dateOfBirth),
        gender: this.currentUser.gender || '',
        interests: this.currentUser.interests || []
      });
    }
  }

  loadUserProfile(): void {
    if (!this.userId) {
      this.isLoading = false;
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.userProfileService.getUserProfile(this.userId).subscribe({
      next: (profile: UserProfile) => {
        this.userProfile = profile;
        this.user = profile; // 为HTML模板设置user属性
        this.isProfileComplete = profile.isProfileComplete;
        
        if (this.isOwnProfile) {
          this.initializeForm();
          
          // 如果个人资料不完整，获取完成步骤
          if (!profile.isProfileComplete) {
            this.loadCompletionSteps();
          }
        }
        
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error loading user profile', error);
        this.errorMessage = 'Failed to load user profile. Please try again.';
        this.isLoading = false;
        
        // 如果是资料设置且出错，尝试使用当前用户信息初始化
        if (this.isProfileSetup && this.currentUser) {
          this.user = {
            id: this.currentUser.id,
            username: this.currentUser.username,
            email: this.currentUser.email,
            photoUrl: this.currentUser.photoUrl,
            isEmailVerified: this.currentUser.isEmailVerified,
            dateOfBirth: this.currentUser.dateOfBirth,
            gender: this.currentUser.gender,
            interests: this.currentUser.interests || [],
            isProfileComplete: false,
            lastActive: this.currentUser.lastActive // 添加lastActive属性
          };
          this.initializeForm();
          this.isLoading = false;
          this.errorMessage = ''; // 清除错误消息
        }
      }
    });
  }

  loadCompletionSteps(): void {
    this.userProfileService.getProfileCompletionSteps(this.userId).subscribe({
      next: (steps: string[]) => {
        this.completionSteps = steps;
      },
      error: (error: any) => {
        console.error('Error loading completion steps', error);
        // 如果获取失败，设置默认的完成步骤
        this.completionSteps = [
          'Upload a profile photo',
          'Add your birthday',
          'Select your gender',
          'Write a bio',
          'Add your location',
          'Select at least 3 interests'
        ];
      }
    });
  }

  // 为input[type=date]格式化日期
  formatDate(date?: Date): string {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    
    return `${year}-${month}-${day}`;
  }

  isInterestSelected(interest: string): boolean {
    const interests = this.profileForm?.get('interests')?.value || [];
    return interests.includes(interest);
  }

  toggleInterest(interest: string): void {
    if (!this.isEditing && !this.isProfileSetup) return;
    
    const interests = [...(this.profileForm.get('interests')?.value || [])];
    const index = interests.indexOf(interest);
    
    if (index === -1) {
      interests.push(interest);
    } else {
      interests.splice(index, 1);
    }
    
    this.profileForm.get('interests')?.setValue(interests);
    this.profileForm.get('interests')?.markAsTouched();
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      // 标记所有字段为触摸状态以显示验证错误
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    this.errorMessage = '';
    
    // 获取表单值
    const profileUpdates = {
      ...this.profileForm.value,
      dateOfBirth: new Date(this.profileForm.value.dateOfBirth)
    };
    
    this.userProfileService.updateUserProfile(this.userId, profileUpdates).subscribe({
      next: (updatedProfile: UserProfile) => {
        this.isSubmitting = false;
        this.userProfile = updatedProfile;
        this.user = updatedProfile; // 更新user属性
        this.isProfileComplete = updatedProfile.isProfileComplete;
        this.successMessage = 'Profile updated successfully';
        
        if (!this.isProfileSetup) {
          this.isEditing = false;
        }
        
        // 如果是个人资料设置且已完成，重定向到匹配
        if (this.isProfileSetup && updatedProfile.isProfileComplete) {
          // 等待一会儿显示成功消息
          setTimeout(() => {
            this.router.navigate(['/match']);
          }, 1500);
        }
      },
      error: (error: any) => {
        this.isSubmitting = false;
        this.errorMessage = error.message || 'Failed to save profile. Please try again.';
        
        // Mock环境下，即使出错也模拟成功保存
        if (error.message === 'Method not implemented. Use the provided implementation in app.config.ts') {
          // 直接更新当前用户的资料
          if (this.currentUser) {
            const updatedUser = {
              ...this.currentUser,
              username: this.profileForm.value.username,
              dateOfBirth: new Date(this.profileForm.value.dateOfBirth),
              gender: this.profileForm.value.gender,
              city: this.profileForm.value.city,
              country: this.profileForm.value.country,
              bio: this.profileForm.value.bio,
              interests: this.profileForm.value.interests || []
            };
            
            this.authService.setCurrentUser(updatedUser);
            
            // 更新用户资料
            this.userProfile = {
              id: updatedUser.id,
              username: updatedUser.username,
              email: updatedUser.email,
              photoUrl: updatedUser.photoUrl,
              dateOfBirth: updatedUser.dateOfBirth,
              gender: updatedUser.gender,
              city: updatedUser.city,
              country: updatedUser.country,
              bio: updatedUser.bio,
              interests: updatedUser.interests,
              isEmailVerified: updatedUser.isEmailVerified,
              isProfileComplete: true // 标记为完成
            };
            
            this.user = this.userProfile;
            this.isProfileComplete = true;
            this.successMessage = 'Profile updated successfully';
            this.errorMessage = '';
            
            if (!this.isProfileSetup) {
              this.isEditing = false;
            }
            
            // 如果是个人资料设置且已完成，重定向到匹配
            if (this.isProfileSetup) {
              // 等待一会儿显示成功消息
              setTimeout(() => {
                this.router.navigate(['/match']);
              }, 1500);
            }
          }
        }
      }
    });
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      // 如果取消编辑，重置表单为原始值
      this.initializeForm();
      this.successMessage = '';
    }
  }

  changeViewMode(mode: string): void {
    this.viewMode = mode;
  }

  // 修改isAdmin方法以避免直接使用isAdmin属性
  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('Admin') || false;
  }

  goToAdminPanel(): void {
    this.router.navigate(['/admin']);
  }

  uploadPhoto(): void {
    // 这将通过真实的文件上传来实现
    console.log('Upload photo functionality would be implemented here');
    
    // 在模拟环境中，随机选择一个默认头像
    if (this.currentUser) {
      const photoIndex = Math.floor(Math.random() * 5) + 1;
      const photoUrl = `assets/images/avatar-${photoIndex}.jpg`;
      
      // 更新当前用户头像
      const updatedUser = {
        ...this.currentUser,
        photoUrl
      };
      
      this.authService.setCurrentUser(updatedUser);
      
      // 更新资料显示
      if (this.userProfile) {
        this.userProfile.photoUrl = photoUrl;
        this.user = { ...this.user, photoUrl };
      }
      
      this.successMessage = 'Profile photo updated';
    }
  }

  goToPreferences(): void {
    this.router.navigate(['/match/settings']);
  }

  // 仅查看个人资料功能
  calculateAge(dateOfBirth?: Date): number {
    if (!dateOfBirth) return 0;
    
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  likeUser(): void {
    // 实现喜欢功能
    this.isLiked = true;
  }

  unlikeUser(): void {
    // 实现取消喜欢功能
    this.isLiked = false;
  }

  sendMessage(): void {
    if (this.userId) {
      this.router.navigate(['/messages', this.userId]);
    }
  }

  cancel(): void {
    if (this.isProfileSetup) {
      // 如果在设置模式下取消，返回到个人资料
      this.router.navigate(['/profile']);
    } else {
      // 用当前数据重新加载表单
      this.initializeForm();
      this.successMessage = '';
    }
  }
}