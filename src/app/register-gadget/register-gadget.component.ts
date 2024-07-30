import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-gadget',
  templateUrl: './register-gadget.component.html',
  styleUrls: ['./register-gadget.component.scss']
})
export class RegisterGadgetComponent implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      imei: ['', Validators.required],
      brand: ['', Validators.required],
      serialNumber: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
      purchaseLocation: ['', Validators.required],
      registrationDate: ['', Validators.required],
      storageSize: ['', Validators.required],
      simType: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      // Handle form submission logic here
      console.log(this.registerForm.value);
    }
  }

  uploadCSV(): void {
    // Handle CSV upload logic here
    console.log('CSV upload clicked');
  }
}
