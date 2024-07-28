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

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        const user = await this.mongoService.login(email, password);
        if (user) {
          this.router.navigate(['/home']);
        }
      } catch (error) {
        console.error('Login failed', error);
      }
    }
  }

  openRegistrationPage() {
    this.router.navigateByUrl('/signup');
  }
}
