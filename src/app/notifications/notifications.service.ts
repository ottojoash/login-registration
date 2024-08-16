// src/app/notifications.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private apiUrl = 'http://localhost:5000/api/notifications'; // Replace with your API endpoint

  constructor(private http: HttpClient) { }

  getNotifications(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getAuthHeaders()
    });
  }

  private getAuthHeaders(): { [key: string]: string } {
    const token = localStorage.getItem('authToken');
    return {
      'Authorization': `Bearer ${token}`
    };
  }
}
