import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VoiceService } from '../services/voice.service';
import { JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable, of, switchMap } from 'rxjs';
import { Project } from './interfaces/projects-response.interface';
import { PreviewResponse } from './interfaces/preview-response.interface';
import { CreateVoiceResponse } from './interfaces/create-voice-response.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent  {
 
}
