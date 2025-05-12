import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { AuthService, User } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser$!: Observable<User | null>;
  currentUser: User | null = null;
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  unreadCount = 0; // 这里应该从消息服务获取
  
  get isAdmin(): boolean {
    // Only check for Admin role to fix the TypeScript error
    return this.currentUser?.roles?.includes('Admin') || false;
  }
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) { }
  
  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
    
    // 同时维护Observable和属性，以便在模板中使用
    this.authService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
      }
    });
    
    // 还可以检查本地存储
    const storedUser = this.authService.getCurrentUser();
    if (storedUser) {
      this.currentUser = storedUser;
    }
    
    // 在实际应用中，应该从消息服务获取未读消息数量
    // this.messageService.getUnreadCount().subscribe(count => {
    //   this.unreadCount = count;
    // });
  }
  
  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  closeDropdown(): void {
    this.isDropdownOpen = false;
  }
  
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    
    // 禁用/启用body滚动
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }
  
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    document.body.style.overflow = '';
  }
  
  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/');
    this.closeDropdown();
  }
  
  goToLogin(): void {
    this.router.navigateByUrl('/auth/login');
    this.closeMobileMenu();
  }
  
  goToRegister(): void {
    this.router.navigateByUrl('/auth/register');
    this.closeMobileMenu();
  }
}