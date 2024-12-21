import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthService } from '@auth0/auth0-angular';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [
      () =>
        inject(AuthService).isAuthenticated$.pipe(
          map((isAuthenticated: boolean) => {
            if (isAuthenticated) {
              return '/home'; // Redirect to home if already logged in
            }
            return true; // Allow access to login if not logged in
          })
        ),
    ],
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [
      () =>
        inject(AuthService)
          .isAuthenticated$
          .pipe(
            map((isAuthenticated) => {
              if (!isAuthenticated) {
                // Redirect to login if not authenticated
                inject(Router).navigate(['/login']);
                return false;
              }
              return true; // Allow access if authenticated
            })
          ),
    ],
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
