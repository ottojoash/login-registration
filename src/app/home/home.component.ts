import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.services'; // Adjust the path based on your project structure

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user = {
    profile: {
      picture: '', // Default profile picture
      name: 'joashotto',
      email: 'louisjoshbricks@gmail.com' // Default email
    }
  };

  isSidebarOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout(); // Clear any authentication data
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
