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
      fullName: ['', Validators.required], // Ensure fullName is always required
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
    const isIndividual = this.selectedCategory === 'Individual';
    
    // Adjust other fields based on the selected category
    if (isIndividual) {
      this.registrationForm.controls['brn'].clearValidators();
      this.registrationForm.controls['tin'].setValidators([Validators.required]);
    } else {
      this.registrationForm.controls['brn'].setValidators([Validators.required]);
      this.registrationForm.controls['tin'].clearValidators();
    }

    // Update the value and validity of the controls
    this.registrationForm.controls['fullName'].updateValueAndValidity(); // Full name is always required
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

  onSubmit(): void {
    if (this.registrationForm.invalid) {
      console.log('Form is invalid:', this.registrationForm.errors);
      console.log('Form Controls:', this.registrationForm.controls);
      return;
    }
  
    const { fullName, email, address, phoneNumber, brn, tin, password } = this.registrationForm.value;
    
    if (!this.selectedCategory) {
      console.error('Category is required');
      return;
    }
  
    const formData = { fullName, email, address, phoneNumber, brn, tin, password, category: this.selectedCategory };
  
    console.log('Form Data:', formData); // Log the data being sent
  
    this.mongoService.register(formData).subscribe({
      next: (response) => {
        console.log('Registration successful', response);
        this.router.navigateByUrl('');
      },
      error: (error) => {
        console.error('Registration failed', error);
      }
    });
  }
  

  openLoginPage(): void {
    this.router.navigateByUrl('');
  }
}
