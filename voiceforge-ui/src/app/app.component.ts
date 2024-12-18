import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';

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
  socket!: WebSocket;

  constructor() {
    // Initialize WebSocket connection
    try {
      this.socket = new WebSocket('ws://127.0.0.1:3000'); // Replace with your backend URL

      this.socket.onopen = () => {
        console.log('WebSocket connection opened.');
      };

      this.socket.onmessage = (event) => {
        const audioBlob = new Blob([event.data], { type: 'audio/wav' });
        const audioURL = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioURL);
        audio.play();
      };

      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.socket.onclose = (event) => {
        console.log('WebSocket connection closed:', event);
      };
    } catch (error) {
      console.error('WebSocket connection failed:', error);
    }
  }

  previewVoice() {
    // Send voice parameters to backend
    const settings = {
      pitch: this.pitch,
      speed: this.speed,
      emotion: this.emotion,
    };
    this.socket.send(JSON.stringify(settings));
  }
}
