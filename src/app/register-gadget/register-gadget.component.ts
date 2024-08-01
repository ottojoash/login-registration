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
  selectedTab: string = 'laptop';  // Default tab
  notificationVisible: boolean = false;
  notificationMessage!: string;

  constructor(private fb: FormBuilder, private mongoService: MongoService) {
    this.registerForm = this.fb.group({
      model: ['', Validators.required],
      imei: [''],
      brand: ['', Validators.required],
      serialNumber: ['', Validators.required],
      color: [''],
      description: ['', Validators.required],
      purchaseLocation: ['', Validators.required],
      registrationDate: ['', Validators.required],
      storageSize: [''],
      simType: [''],
      phoneNumber: [''],
      network: [''],
      type: [this.selectedTab, Validators.required]  // Initialize with default tab value
    });
  }

  ngOnInit(): void {
    this.selectTab(this.selectedTab);  // Ensure form is initialized correctly
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Submitting form with data:', this.registerForm.value); // Log data to verify
      this.mongoService.addGadget(this.registerForm.value).then(result => {
        console.log('Gadget registered successfully:', result);
        this.notificationMessage = 'Gadget registered successfully!';
        this.notificationVisible = true;

        setTimeout(() => {
          this.notificationVisible = false;
        }, 3000);

        this.registerForm.reset();
        this.selectedTab = 'laptop';  // Reset to default tab
        this.selectTab(this.selectedTab);  // Re-apply form validation rules
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
    this.registerForm.controls['type'].setValue(tab);  // Set the selected tab as type

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
