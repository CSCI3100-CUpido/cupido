// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { tap } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // 在开发/演示模式下，如果没有登录则自动登录
  if (environment.demoMode && !authService.isLoggedIn()) {
    console.log('AuthGuard: Auto-login for demo mode');
    
    // 自动登录后继续原有导航
    return authService.login({
      email: 'user@link.cuhk.edu.hk',
      password: 'User123'
    }).pipe(
      map(() => true),
      tap((loggedIn) => {
        if (!loggedIn) {
          router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
        }
      })
    );
  }
  
  // 正常登录检查逻辑
  const loggedIn = authService.isLoggedIn();
  if (!loggedIn) {
    router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }
  return loggedIn;
};