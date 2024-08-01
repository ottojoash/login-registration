// src/app/register-gadget/register-gadget.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MongoService } from '../mongo.service';

@Component({
  selector: 'app-register-gadget',
  templateUrl: './register-gadget.component.html',
  styleUrls: ['./register-gadget.component.scss']
})
export class RegisterGadgetComponent implements OnInit {
  registerForm: FormGroup;
  selectedTab: string = 'laptop';
  notificationVisible: boolean = false;
  notificationMessage!: string;

  constructor(private fb: FormBuilder, private mongoService: MongoService) {
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
      this.mongoService.addGadget(this.registerForm.value).then(result => {
        console.log('Gadget registered successfully:', result);
        // Show the popup notification
         this.notificationMessage = 'Gadget registered successfully!';
         this.notificationVisible = true;

      // Hide the notification after 3 seconds
          setTimeout(() => {
            this.notificationVisible = false;
          }, 3000);

      // Optionally, you can reset the form after successful submission
      this.registerForm.reset();
        alert('Gadget registered successfully');
      }).catch(error => {
        console.error('Error registering gadget:', error);
        alert('Error registering gadget');
      });
    }
  }

  uploadCSV(): void {
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
