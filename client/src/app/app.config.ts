// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

// Services imports
import { AuthService } from './services/auth.service';
import { MockAuthService } from './services/mock-auth.service';
import { ConfessionService } from './services/confession.service';
import { MockConfessionService } from './services/mock-confession.service';
import { MatchingService } from './services/matching.service';
import { MockMatchingService } from './services/mock-matching.service';
import { EnhancedMatchingService } from './services/enhanced-matching.service';
import { VerificationService } from './services/verification.service';
import { MockVerificationService } from './services/mock-verification.service';
import { UserProfileService } from './services/user-profile.service';
import { MockUserProfileService } from './services/mock-user-profile.service';
import { NavigationService } from './services/navigation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    // 提供所有需要的服务
    { provide: AuthService, useClass: MockAuthService },
    { provide: ConfessionService, useClass: MockConfessionService },
    { provide: MatchingService, useClass: EnhancedMatchingService },
    { provide: VerificationService, useClass: MockVerificationService },
    { provide: UserProfileService, useClass: MockUserProfileService },
    NavigationService
  ]
};

