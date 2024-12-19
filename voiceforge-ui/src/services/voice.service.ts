// src/app/voice.service.ts

import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  private apiUrl = 'http://localhost:3000'; // Backend URL to fetch voices

  constructor(private http: HttpClient) {}

  // Method to get the voices from the backend
  getVoices(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/voices`); // HTTP GET request to the voices endpoint
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
