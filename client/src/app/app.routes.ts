import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ConfessionBoardComponent } from './components/confession-board/confession-board.component';
import { DatingRecommendationComponent } from './components/dating-recommendation/dating-recommendation.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { VerifyEmailComponent } from './components/auth/verify-email/verify-email.component';
import { MessageListComponent } from './components/message/message-list.component';
import { MessageDetailComponent } from './components/message/message-detail.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'confessions', component: ConfessionBoardComponent },
  { path: 'matches', component: DatingRecommendationComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'verify-email', component: VerifyEmailComponent },
  // 添加消息路由
  { path: 'messages', component: MessageListComponent },
  { path: 'messages/:id', component: MessageDetailComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];