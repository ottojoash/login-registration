import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.services'; // Adjust the path based on your project structure

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any = {
    profile: {
      picture: '', // Default profile picture
      fullName: '',
      email: ''
    },
    category: '' // Default category
  };

  isSidebarOpen = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.setInitialUserDetails();
  }

  setInitialUserDetails(): void {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode token payload
        this.user.profile.fullName = tokenData.fullName || ''; // Extract name
        this.user.profile.email = tokenData.email || ''; // Extract email
        this.user.category = tokenData.category || ''; // Extract category
        
        console.log('User Details from Token:', this.user); // Debugging line
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout(); // Clear any authentication data
    this.router.navigate(['/login']); // Redirect to the login page
  }
}
