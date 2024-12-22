import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../../../services/voice.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { Project } from '../../interfaces/projects-response.interface'
import { PreviewResponse } from '../../interfaces/preview-response.interface';
import { CreateVoiceResponse } from '../../interfaces/create-voice-response.interface';
import { AuthService } from '@auth0/auth0-angular';
import { Token } from '@angular/compiler';
import { Voice } from '../../interfaces/voice.interface';
import { Clip } from '../../interfaces/clip.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, FormsModule, NgIf, NgFor, JsonPipe],
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  title = 'voiceforge';

  // Voice settings state
  pitch: number = 1.0;
  speed: number = 1.0;
  emotion: string = 'neutral';

  // Local data
  selectedVoiceId: string | null = null; // Holds selected voice UUID
  selectedVoice: Voice | undefined = undefined; // Holds the selected voice
  textToSynthesize: string = '';  // Custom text input
  voiceData = {
    name: '',
    consent: '',
    dataset_url: '',
  };
  currentPage: number = 1;   // Current page of clips
  clipsPerPage: number = 5; 
  paginatedClips: Clip[] = [];

  // Local data - Audio recording data
  isRecording = false;
  audioUrl: string | null = null;
  base64Audio: string = '';  // Base64 string of the recorded/uploaded audio
  fileName: string | null = null;
  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];

  // Data received
  projectUUID = '';
  voices: any[] = []; // Holds the list of voices
  previewData: any | PreviewResponse = {};
  clipsList: Clip[] = []

  userProfile: any;
  accessToken: Token | undefined;

  get totalPages(): number {
    return Math.ceil(this.clipsList.length / this.clipsPerPage);
  }

  constructor(private voiceService: VoiceService, private auth: AuthService) { }

  ngOnInit(): void {
    // Fetch user profile and access token after login
    this.auth.user$
      .pipe(
        switchMap((user: any) => {
          // Store the user profile
          this.userProfile = user;
          console.log('User Profile:', user);

          // Get the access token as well
          return this.auth.idTokenClaims$ as Observable<any>; // Or use accessToken$ depending on the type of token you need
        }),
        switchMap((token: Token) => {
          // Store the access token
          this.accessToken = token;
          console.log('Access Token:', token);

          // Continue fetching projects after receiving the token
          return this.fetchProjects();
        }),
        switchMap((projects: any) => {
          // Find the specific project you need
          projects?.items.find((project: any) => {
            if (project.name === 'VoiceForge') {
              this.projectUUID = project.uuid;
            }
          });

          // Fetch the voices for the selected project
          return this.fetchClips(this.projectUUID);
        }),
        switchMap((clips: Clip[]) => {
          this.clipsList = clips;
          this.updateClipsList();
          return this.fetchVoices();
        })

      )
      .subscribe({
        next: (response: any) => {
          console.log('Voices fetched:', response);
          this.voices = response || []; // Store the fetched voices
        },
        // TODO: look into if this catches an error at any place along the chain of switchmaps
        error: (err: any) => {
          console.error('Error:', err);
        },
      });
  }

  ngOnDestroy() {
    // Cleanup any necessary resources when the component is destroyed
  }


  // Fetch the list of voices from the backend
  fetchVoices(): Observable<any> {
    return this.voiceService.getVoices();
  }

  fetchProjects(): Observable<any> {
    return this.voiceService.getProjects()
  }

  fetchClips(project_uuid: string): Observable<any> {
    return this.voiceService.getClips(project_uuid);
  }

  // Update paginated clips without modifying clipsList
  updateClipsList(): void {
    const startIndex = (this.currentPage - 1) * this.clipsPerPage;
    const endIndex = startIndex + this.clipsPerPage;
    this.paginatedClips = this.clipsList.slice(startIndex, endIndex);
    console.log('Paginated clips:', this.paginatedClips);
  }

  // Go to the next page of clips
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateClipsList();
    }
  }

  // Go to the previous page of clips
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateClipsList();
    }
  }

  // Start recording
  startRecording() {
    if (navigator.mediaDevices) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.mediaRecorder = new MediaRecorder(stream);
          this.mediaRecorder.ondataavailable = (event) => {
            this.audioChunks.push(event.data);
          };

          this.mediaRecorder.onstop = () => {
            const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
            this.audioUrl = URL.createObjectURL(audioBlob);
            this.convertAudioToBase64(audioBlob);
          };

          this.mediaRecorder.start();
          this.isRecording = true;
        })
        .catch((err) => console.error('Error accessing audio device', err));
    }
  }

  // Stop recording
  stopRecording() {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.isRecording = false;
    }
  }

  // Convert audio to Base64
  convertAudioToBase64(audioBlob: Blob) {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.base64Audio = reader.result as string;
    };
    reader.readAsDataURL(audioBlob);
  }

  // Handle file upload
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio')) {
      this.fileName = file.name;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.base64Audio = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Submit form to create voice
  createVoice() {
    if (!this.voiceData.name || !this.base64Audio) {
      alert('Please provide all required fields');
      return;
    }

    // Send the API request to create the voice
    // (Here you would call your service method to make the actual request)
    console.log('Creating voice with data:', this.voiceData);
  }

  // Method to create a voice from the backend
  // createVoice() {
  //   if (!this.voiceData.name || !this.voiceData.consent) {
  //     alert('Name and consent audio are required.');
  //     return;
  //   }

  //   this.voiceService.createVoice(this.voiceData).subscribe({
  //     next: (response: CreateVoiceResponse) => {
  //       alert('Voice created successfully!');
  //       console.log(response);
  //     },
  //     error: (err) => {
  //       console.error('Error creating voice:', err);
  //       alert('Failed to create voice.');
  //     },
  //   });
  // }

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
    console.log('payload:' + JSON.stringify(payload));  // <-- Log payload

    // Send the voice preview request to the backend
    this.voiceService.previewVoice(payload).subscribe({
      next: (response: PreviewResponse) => {
        this.previewData = response;
        this.playAudio(response.audioUrl.item.audio_src);
      },
      error: (err: Error) => console.error('Error previewing voice:', err),
    });
  }


 deleteClip(clipUUID: string){
    try {
      this.voiceService.deleteClip(this.projectUUID, clipUUID)
      .subscribe(res => {
        console.log('deleted clip'+clipUUID+' and got:',res)
        this.clipsList = this.clipsList.filter((clip) => clip.uuid !== clipUUID);
      })
     
    } catch (error) {
      console.error('Failed to delete clip:', error);
      alert('An error occurred while deleting the clip.');
    }
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
  selectVoice(voice: Voice) {
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

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: `${window.location.origin}/login` } });
  }
}
