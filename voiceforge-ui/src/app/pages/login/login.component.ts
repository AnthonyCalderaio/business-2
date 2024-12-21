import { Component, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: 'login.component.html',
  styles: ['login.component.scss'],
})
export class LoginComponent {
  auth = inject(AuthService);

  login() {
    this.auth.loginWithRedirect();
  }
}
