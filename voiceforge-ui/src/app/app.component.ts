import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../services/voice.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgFor],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'voiceforge';

  // Voice settings state
  pitch: number = 1.0;
  speed: number = 1.0;
  emotion: string = 'neutral';

  // API response and voices data
  voices: any[] = []; // Holds the list of voices
  selectedVoiceId: string | null = null; // Holds selected voice UUID

  constructor(private voiceService: VoiceService) {}

  ngOnInit() {
    this.fetchVoices(); // Fetch the list of voices when the component is initialized
  }

  ngOnDestroy() {
    // Cleanup any necessary resources when the component is destroyed
  }

  // Fetch the list of voices from the backend
  fetchVoices() {
    this.voiceService.getVoices().subscribe({
      next: (response: any) => {
        console.log('Voices fetched:', response);
        this.voices = response || []; // Store the fetched voices
      },
      error: (err: Error) => {
        console.error('Error fetching voices:', err);
      },
    });
  }

  // Method to send voice settings and generate preview with selected voice
  previewVoice() {
    if (!this.isValidSettings() || !this.selectedVoiceId) {
      return;
    }

    const settings = {
      pitch: this.pitch,
      speed: this.speed,
      emotion: this.emotion,
      voiceId: this.selectedVoiceId,
    };

    console.log('Sending settings to server:', settings);
    // this.voiceService.sendVoiceSettings(settings); // Send settings to the backend via the service
  }

  // Validating the settings before sending them to the backend
  isValidSettings(): boolean {
    if (this.pitch < 0.5 || this.pitch > 2.0) {
      console.warn('Pitch must be between 0.5 and 2.0');
      return false;
    }
    if (this.speed < 0.5 || this.speed > 2.0) {
      console.warn('Speed must be between 0.5 and 2.0');
      return false;
    }
    if (!['neutral', 'happy', 'sad'].includes(this.emotion)) {
      console.warn('Emotion must be one of: neutral, happy, sad');
      return false;
    }
    return true;
  }

  // Method to select a voice from the list
  selectVoice(voiceId: string) {
    this.selectedVoiceId = voiceId;
    console.log('Selected voice:', voiceId);
  }
}
