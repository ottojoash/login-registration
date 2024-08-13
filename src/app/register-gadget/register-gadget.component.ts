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
  notificationMessage: string = ''; // Initialize with an empty string
  selectedFile: File | null = null; // Store the selected file

  constructor(private fb: FormBuilder, private mongoService: MongoService) {
    this.registerForm = this.fb.group({
      model: ['', Validators.required],
      imei: [''],
      deviceId: [''],  // Initialize deviceId
      ram: [''],  // Initialize ram
      brand: ['', Validators.required],
      serialNumber: ['', Validators.required],
      color: [''],
      description: ['', Validators.required],
      purchaseLocation: ['', Validators.required],
      registrationDate: ['', Validators.required],
      storageSize: ['', Validators.required],
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
      const formData = this.registerForm.value;
      formData.type = this.selectedTab; // Add the selected tab as type
      console.log('Submitting form data:', formData); // Log the data to be sent
  
      this.mongoService.addGadget(formData).then(result => {
        console.log('Gadget registered successfully:', result);
        this.notificationMessage = 'Gadget registered successfully!';
        this.notificationVisible = true;
        setTimeout(() => {
          this.notificationVisible = false;
        }, 3000);
        this.registerForm.reset();
        this.selectedTab = 'laptop';
        this.selectTab(this.selectedTab);
      }).catch(error => {
        console.error('Error registering gadget:', error);
        this.notificationMessage = 'Error registering gadget';
        this.notificationVisible = true;
        setTimeout(() => {
          this.notificationVisible = false;
        }, 3000);
      });
    } else {
      console.log('Form is invalid');
      this.notificationMessage = 'Please fill out all required fields';
      this.notificationVisible = true;
      setTimeout(() => {
        this.notificationVisible = false;
      }, 3000);
    }
  }
  
  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.uploadCSV(this.selectedFile);
    }
  }

  uploadCSV(file: File): void {
    console.log('CSV upload clicked with file:', file);

    if (file) {
      this.mongoService.uploadCSV(file).then(result => {
        console.log('CSV uploaded successfully:', result);
        this.notificationMessage = 'CSV uploaded successfully!';
        this.notificationVisible = true;
        setTimeout(() => {
          this.notificationVisible = false;
        }, 3000);
      }).catch(error => {
        console.error('Error uploading CSV:', error);
        this.notificationMessage = 'Error uploading CSV';
        this.notificationVisible = true;
        setTimeout(() => {
          this.notificationVisible = false;
        }, 3000);
      });
    }
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
    this.registerForm.controls['type'].setValue(tab);  // Set the selected tab as type

    if (tab === 'laptop') {
      this.registerForm.controls['phoneNumber'].clearValidators();
      this.registerForm.controls['network'].clearValidators();
      this.registerForm.controls['ram'].setValidators(Validators.required); // RAM is required for laptops
      this.registerForm.controls['deviceId'].setValidators(Validators.required); // Device ID is required for laptops
      this.registerForm.controls['simType'].clearValidators();
    } else if (tab === 'phone') {
      this.registerForm.controls['ram'].clearValidators();
      this.registerForm.controls['deviceId'].clearValidators();
      this.registerForm.controls['phoneNumber'].setValidators(Validators.required); // Phone number is required for phones
      this.registerForm.controls['network'].setValidators(Validators.required); // Network is required for phones
      this.registerForm.controls['simType'].setValidators(Validators.required); // SIM Type is required for phones
    }

    // Update validity based on the selected tab
    this.registerForm.controls['phoneNumber'].updateValueAndValidity();
    this.registerForm.controls['network'].updateValueAndValidity();
    this.registerForm.controls['storageSize'].updateValueAndValidity();
    this.registerForm.controls['simType'].updateValueAndValidity();
    this.registerForm.controls['ram'].updateValueAndValidity();
    this.registerForm.controls['deviceId'].updateValueAndValidity();
  }
}
