import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../services/voice.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { Project } from './interfaces/projects-response.interface';
import { PreviewResponse } from './interfaces/preview-response.interface';
import { CreateVoiceResponse } from './interfaces/create-voice-response.interface';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  {

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Check if the user is authenticated on app initialization
    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (isAuthenticated) {
        // If authenticated, redirect to home page
        this.router.navigate(['/home']);
      } else {
        // If not authenticated, redirect to login page
        this.router.navigate(['/login']);
      }
    });

    this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('Is Authenticated:', isAuthenticated);
    });
    
    this.auth.idTokenClaims$.subscribe((claims) => {
      console.log('ID Token Claims:', claims);
    });
  }
 
}
