import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MongoService } from '../mongo.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm: FormGroup;
  selectedCategory: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private mongoService: MongoService
  ) { 
    this.registrationForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      brn: [''],
      tin: [''],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.selectedCategory = params['category'];
      console.log('Selected Category:', this.selectedCategory);
      this.adjustFormFields();
    });
  }

  adjustFormFields(): void {
    if (this.selectedCategory === 'Individual') {
      this.registrationForm.controls['fullName'].clearValidators();
      this.registrationForm.controls['brn'].clearValidators();
      this.registrationForm.controls['tin'].setValidators([Validators.required]);
    } else {
      this.registrationForm.controls['fullName'].setValidators([Validators.required]);
      this.registrationForm.controls['brn'].setValidators([Validators.required]);
      this.registrationForm.controls['tin'].clearValidators();
    }
    this.registrationForm.controls['fullName'].updateValueAndValidity();
    this.registrationForm.controls['brn'].updateValueAndValidity();
    this.registrationForm.controls['tin'].updateValueAndValidity();
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ matchingPasswords: true });
    } else {
      control.get('confirmPassword')?.setErrors(null);
    }
    return null;
  }

  async onSubmit() {
    if (this.registrationForm.invalid) {
      console.log('Form is invalid:', this.registrationForm.errors);
      return; // If the form is invalid, do not submit
    }

    const { fullName, email, address, phoneNumber, brn, tin, password } = this.registrationForm.value;
    const data = { fullName, email, address, phoneNumber, brn, tin, password };

    console.log('Form Data:', data); // Add this line

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
