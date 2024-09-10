import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GadgetService {
  private apiUrl = 'https://gadget-backend.onrender.com/api/gadgets'; // Updated base URL

  constructor(private http: HttpClient) {}

  // Method to get the token from local storage
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken'); // Replace 'token' with the actual key where the token is stored
  }

  // Update a gadget by its ID
  updateGadget(id: string, gadget: any): Observable<any> {
    const authToken = this.getAuthToken();
    let headers = new HttpHeaders();
    if (authToken) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    return this.http.put(`${this.apiUrl}/update/${id}`, gadget, { headers });
  }
}
