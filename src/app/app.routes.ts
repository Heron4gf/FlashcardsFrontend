import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Quiz } from './pages/quiz/quiz';
import { Auth } from './pages/auth/auth';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: 'auth', component: Auth },
  { 
    path: '', 
    component: Home, 
    canActivate: [authGuard] 
  },
  { 
    path: 'quiz', 
    component: Quiz, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];
