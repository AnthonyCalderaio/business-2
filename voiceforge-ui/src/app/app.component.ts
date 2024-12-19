import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../services/voice.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { Project } from './interfaces/projects-response.interface';
import { PreviewResponse } from './interfaces/preview-response.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgFor, JsonPipe],
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
  
  selectedVoiceId: string | null = null; // Holds selected voice UUID
  selectedVoice: any = null; // Holds the selected voice
  textToSynthesize: string = '';  // Custom text input
  projectUUID = '';

  voices: any[] = []; // Holds the list of voices
  previewData: any | PreviewResponse = {};


  constructor(private voiceService: VoiceService) {}

  ngOnInit() {
    this.fetchProjects()
    .pipe(
      switchMap((projects: any) => {
        projects?.items.find((project:any) =>{if(project.name === "VoiceForge"){this.projectUUID = project.uuid}})
        return this.fetchVoices()
      })
    )
    .subscribe({
      next: (response: Project[]) => {
        console.log('Voices fetched:', response);
        this.voices = response || []; // Store the fetched voices
      },
      error: (err: Error) => {
        console.error('Error fetching voices:', err);
      },
    });
  }

  ngOnDestroy() {
    // Cleanup any necessary resources when the component is destroyed
  }


  // Fetch the list of voices from the backend
  fetchVoices() {
    return this.voiceService.getVoices()
    
  }

  fetchProjects(): Observable<any> {
   return this.voiceService.getProjects()
  }

  // Method to send voice settings and generate preview with selected voice
  previewVoice() {
    if (!this.selectedVoice || !this.textToSynthesize) {
      console.warn('Please select a voice and enter text.');
      return;
    }
  
    // Log the payload to ensure it's correctly formed
    const payload = {
      projectId: this.projectUUID, // Pass the project UUID
      voiceId: String(this.selectedVoice.uuid), // Pass the selected voice ID
      text: this.textToSynthesize, // The text to synthesize
      pitch: this.pitch,
      speed: this.speed,
      emotion: this.emotion,
    };
    console.log('payload:'+JSON.stringify(payload));  // <-- Log payload
  
    // Send the voice preview request to the backend
    this.voiceService.previewVoice(payload).subscribe({
      next: (response: PreviewResponse) => {
        this.previewData = response; 
        this.playAudio(response.audioUrl.item.audio_src);
      },
      error: (err: Error) => console.error('Error previewing voice:', err),
    });
  }

    // Method to play the audio from the URL
    playAudio(audioUrl: string) {
      const audio = new Audio(audioUrl);
      audio.play().catch((err) => {
        console.error('Error playing audio:', err);
      });
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
  selectVoice(voice: string) {
    this.selectedVoice = voice;
    console.log('Selected voice:', voice);
  }

  generateAudio() {
    if (this.selectedVoice) {
      const settings = {
        pitch: this.pitch,
        speed: this.speed,
        emotion: this.emotion,
      };
      const voiceUuid = this.selectedVoice.uuid; // Assuming each voice has a uuid

      // Call backend to generate audio
    //   this.voiceService.generateAudio(voiceUuid, settings).subscribe({
    //     next: (audioData: any) => {
    //       // this.playAudio(audioData);
    //     },
    //     error: (err: Error) => console.error('Error generating audio:', err),
    //   });
    // } else {
    //   console.warn('Please select a voice first');
    }
  }
}
