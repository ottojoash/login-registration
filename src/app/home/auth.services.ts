import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  logout() {
    localStorage.removeItem('userToken'); // Clear the user token from localStorage
    // You can clear other related data as needed
  }
}
