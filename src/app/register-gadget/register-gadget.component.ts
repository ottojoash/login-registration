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
  selectedFile: File | null = null; // Store the selected file

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
        alert('Error registering gadget');
      });
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
        alert('Error uploading CSV');
      });
    }
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
