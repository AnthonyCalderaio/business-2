// src/app/voice.service.ts

import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CreateVoiceResponse } from '../app/mocks/create-voice-response';
import { environment } from '../environments/environment'; // Import the environment

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private apiUrl = environment.backendUrl; // Backend URL to fetch voices

  constructor(private http: HttpClient) {}

  // Method to get the voices from the backend
  getVoices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/voices`); // HTTP GET request to the voices endpoint
  }

  getClips(project_uuid?: string): Observable<any> {
    let params = new HttpParams();
    if (project_uuid) {
      params = params.set('project_uuid', project_uuid);
    }
    return this.http.get<any>(`${this.apiUrl}/clips`, { params });
  }

  // Method to create a voices from the backend
  createVoice(voiceData: any): Observable<any> {
    return of(CreateVoiceResponse)//this.http.post<any>(`${this.apiUrl}/create-voice`, voiceData);
  }

  // Request the preview audio from the backend
  previewVoice(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/preview`, payload);
  }

  getProjects(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/projects`);
  }

  // generateAudio(){}
}
