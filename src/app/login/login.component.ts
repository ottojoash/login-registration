import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MongoService } from '../mongo.service'; // Import MongoService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private mongoService: MongoService // Inject MongoService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.mongoService.login(email, password).subscribe({
        next: (response) => {
          if (response.success) {
            // Store token if needed
            localStorage.setItem('authToken', response.token);
            console.log('Login successful', response.token);
            this.router.navigate(['/home']); // Navigate to the dashboard page
          } else {
            console.error('Login failed:', response.message);
          }
        },
        error: (error) => {
          console.error('Login failed:', error.error?.message || 'No error message provided');
        }
      });
    }
  }
  
  openRegistrationPage(): void {
    this.router.navigateByUrl('/signup');
  }
}
