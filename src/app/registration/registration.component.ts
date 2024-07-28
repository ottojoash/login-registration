import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MongoService } from '../mongo.service'; // Import MongoService

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private mongoService: MongoService) { 
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      brn: [''],
      tin: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // Initialization logic if any
  }

  async onSubmit() {
    if (this.registrationForm.invalid) {
      return; // If the form is invalid, do not submit
    }

    const { fullName, email, address, phoneNumber, brn, tin, password } = this.registrationForm.value;
    const data = { fullName, email, address, phoneNumber, brn, tin, password };

    try {
      await this.mongoService.register(email, password, fullName, address, phoneNumber, brn, tin, data);
      console.log('Registration successful');
      this.router.navigateByUrl('');
    } catch (error) {
      console.error('Registration failed', error);
    }
  }

  openLoginPage() {
    this.router.navigateByUrl('');
  }
}
