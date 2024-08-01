import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-gadget',
  templateUrl: './register-gadget.component.html',
  styleUrls: ['./register-gadget.component.scss']
})
export class RegisterGadgetComponent implements OnInit {
  registerForm: FormGroup;
  selectedTab: string = 'laptop';

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      model: ['', Validators.required],
      imei: ['', Validators.required],
      brand: ['', Validators.required],
      serialNumber: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
      purchaseLocation: ['', Validators.required],
      registrationDate: ['', Validators.required],
      storageSize: ['', Validators.required],
      simType: ['', Validators.required],
      phoneNumber: [''],
      network: ['']
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

  selectTab(tab: string): void {
    this.selectedTab = tab;
    if (tab === 'laptop') {
      this.registerForm.controls['phoneNumber'].clearValidators();
      this.registerForm.controls['network'].clearValidators();
      this.registerForm.controls['storageSize'].setValidators(Validators.required);
      this.registerForm.controls['simType'].setValidators(Validators.required);
    } else if (tab === 'phone') {
      this.registerForm.controls['storageSize'].clearValidators();
      this.registerForm.controls['simType'].clearValidators();
      this.registerForm.controls['phoneNumber'].setValidators(Validators.required);
      this.registerForm.controls['network'].setValidators(Validators.required);
    }
    this.registerForm.controls['phoneNumber'].updateValueAndValidity();
    this.registerForm.controls['network'].updateValueAndValidity();
    this.registerForm.controls['storageSize'].updateValueAndValidity();
    this.registerForm.controls['simType'].updateValueAndValidity();
  }
}
