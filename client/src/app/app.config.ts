import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { AuthService } from './services/auth.service';
import { MockAuthService } from './services/mock-auth.service';
import { ConfessionService } from './services/confession.service';
import { MockConfessionService } from './services/mock-confession.service';
import { RecommendationService } from './services/recommendation.service';
import { MockRecommendationService } from './services/mock-dating-recommendation.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([])),
    // Provide mock services
    { provide: AuthService, useClass: MockAuthService },
    { provide: ConfessionService, useClass: MockConfessionService },
    { provide: RecommendationService, useClass: MockRecommendationService }
  ]
};
