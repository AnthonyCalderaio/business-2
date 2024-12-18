import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  title = 'voiceforge';
  pitch: number = 1.0; // Default value
  speed: number = 1.0; // Default value
  emotion: string = 'neutral'; // Default emotion

  socket$: WebSocketSubject<any>;
  receivedMessage: string = '';

  constructor() {
    // Initialize WebSocket connection
    this.socket$ = new WebSocketSubject('ws://localhost:3000'); // Ensure this URL is correct

    // Handle messages received from WebSocket
    this.socket$.subscribe({
      next: (message) => {
        console.log('Received message from server:', message);
        this.receivedMessage = message; // Store the received message to display
      },
      error: (err) => console.error('WebSocket error:', err),
      complete: () => console.log('WebSocket connection closed'),
    });
  }

  // Method to send voice settings to backend
  previewVoice() {
    const settings = {
      pitch: this.pitch,
      speed: this.speed,
      emotion: this.emotion,
    };
    
    this.socket$.next(settings); // Send settings to the server
    console.log('Sent settings to server:', settings);
  }

  // Cleanup WebSocket when component is destroyed
  ngOnDestroy() {
    if (this.socket$) {
      this.socket$.complete(); // Close the WebSocket connection when the component is destroyed
    }
  }
}
