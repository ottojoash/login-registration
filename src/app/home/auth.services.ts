import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getToken() {
    throw new Error('Method not implemented.');
  }
  logout() {
    localStorage.removeItem('userToken'); // Clear the user token from localStorage
    // You can clear other related data as needed
  }
}
