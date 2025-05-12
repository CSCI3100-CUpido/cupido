// src/app/app.providers.ts
import { Provider } from '@angular/core';
import { AuthService } from './services/auth.service';
import { MockAuthService } from './services/mock-auth.service';
import { MatchingService } from './services/matching.service';
import { environment } from '../environments/environment';

/**
 * Providers for the application
 * Using mock services in demo mode
 */
export const getProviders = (): Provider[] => {
  const providers: Provider[] = [];
  
  if (environment.demoMode) {
    // Use mock services in demo mode
    providers.push(
      { provide: AuthService, useExisting: MockAuthService }
    );
  }
  
  return providers;
};