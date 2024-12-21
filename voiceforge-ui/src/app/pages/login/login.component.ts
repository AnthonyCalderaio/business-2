import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.component.html',
  styleUrls: ['login.component.scss'],
})
export class LoginComponent {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if we are returning from Auth0 after authentication
    this.auth.handleRedirectCallback().subscribe({
      next: (result) => {
        // Successful login, redirect to home page
        this.router.navigate(['/home']);
      },
      error: (error) => {
        // If error occurs during handling the redirect, log it
        console.error('Error during redirect callback:', error);
      }
    });
  }

  // Trigger the login process
  login(): void {
    this.auth.loginWithRedirect({
      // No need to specify redirectUri, Auth0 will use the default callback URL set in the dashboard
    });
  }
}
