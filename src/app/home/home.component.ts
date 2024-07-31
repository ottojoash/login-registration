import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  user = {
    profile: {
      picture: '', // Default profile picture
      name:'joashotto',
      email: 'louisjoshbricks@gmail.com' // Default email
    }
  };

  logout() {
    // Implement logout logic
  }
}
