import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MongoService } from '../mongo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  user: any;
  gadgetForm: FormGroup;

  constructor(private fb: FormBuilder, private mongoService: MongoService) { 
    this.gadgetForm = this.fb.group({
      model: ['', Validators.required],
      imei: ['', Validators.required],
      brand: ['', Validators.required],
      serialNumber: ['', Validators.required],
      color: ['', Validators.required],
      description: ['', Validators.required],
      purchaseLocation: ['', Validators.required],
      registrationDate: ['', Validators.required],
      storageSize: ['', Validators.required],
      simType: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.user = await this.mongoService.getUser();
  }

  async logout() {
    await this.mongoService.logout();
  }

  onSubmit() {
    if (this.gadgetForm.valid) {
      console.log('Gadget registered:', this.gadgetForm.value);
      // Call the service to register the gadget
    } else {
      console.log('Form is invalid');
    }
  }

  uploadCSV() {
    console.log('CSV upload function');
    // Implement the CSV upload functionality
  }
}
