// src/app/mongo.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class MongoService {

  private apiUrl = 'http://localhost:5000/api'; // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  register(fullName: string, email: string, address: string, phoneNumber: string, brn: string, tin: string, password: string): Observable<any> {
    const registerData = { fullName, email, address, phoneNumber, brn, tin, password };
    return this.http.post(`${this.apiUrl}/auth/register`, registerData);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password });
  }

  addGadget(gadget: any): Promise<any> {
    return this.http.post('http://localhost:5000/api/gadgets/register', gadget).toPromise();
  }
  

  // Add this method
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user'); // Check if user data exists in local storage
  }

  // Optional method to get user details
  getUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/current-user`);
  }
}
