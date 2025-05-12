// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { MatchComponent } from './components/match/match.component';
import { MatchDashboardComponent } from './components/match/match-dashboard.component';
import { MatchSettingsComponent } from './components/match/match-settings.component';
import { MatchExplorerComponent } from './components/match/match-explorer.component'; // Nuevo
import { ProfileComponent } from './components/profile/profile.component';
import { ConfessionBoardComponent } from './components/confession-board/confession-board.component';
import { MessageListComponent } from './components/message/message-list.component';
import { MessageDetailComponent } from './components/message/message-detail.component';
import { VerificationCodeComponent } from './components/auth/verification-code/verification-code.component'; // Nuevo
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  
  // Auth routes - lazy loaded
  { 
    path: 'auth', 
    loadChildren: () => import('./components/auth/auth.routes').then(r => r.AUTH_ROUTES) 
  },
  
  // Verificación Email
  { path: 'verification-code', component: VerificationCodeComponent, canActivate: [authGuard] },
  
  // Match routes
  { path: 'match', component: MatchDashboardComponent, canActivate: [authGuard] },
  { path: 'match/swipe', component: MatchComponent, canActivate: [authGuard] },
  { path: 'match/settings', component: MatchSettingsComponent, canActivate: [authGuard] },
  { path: 'match/explore', component: MatchExplorerComponent, canActivate: [authGuard] }, // Nuevo explorer
  
  // Profile routes
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [authGuard] },
  { path: 'profile-setup', component: ProfileComponent, canActivate: [authGuard] },
  
  // Confession routes
  { path: 'confessions', component: ConfessionBoardComponent },
  
  // Message routes
  { path: 'messages', component: MessageListComponent, canActivate: [authGuard] },
  { path: 'messages/:id', component: MessageDetailComponent, canActivate: [authGuard] },
  
  // Wildcard route - redirect to home
  { path: '**', redirectTo: '', pathMatch: 'full' }
];