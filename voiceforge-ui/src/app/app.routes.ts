import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { AuthService } from '@auth0/auth0-angular';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { HomeComponent } from './pages/home/home.component';

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
          inject(AuthService)
            .isAuthenticated$
            .pipe(
              map((isAuthenticated:boolean) => {
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
                  return '/login'; // Redirect to login if not authenticated
                }
                return true; // Allow access to home page
              })
            ),
      ],
    },
    {
      path: '**',
      redirectTo: 'login',
    },
  ];

