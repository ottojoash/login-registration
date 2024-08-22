import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-batch-transfer-ownership',
  templateUrl: './batch-transfer-ownership.component.html',
  styleUrls: ['./batch-transfer-ownership.component.scss']
})
export class BatchTransferOwnershipComponent implements OnInit {
  searchQuery: string = '';
  gadgets: any[] = [];
  selectedTab: string = 'laptop';
  private token: string = '';
  showModal: boolean = false; // Control modal visibility
  batchTransferForm!: FormGroup; // Form group for batch transfer form

  constructor(private http: HttpClient, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || '';
    this.fetchGadgets();
    this.initializeForm(); // Initialize the form on component load
  }

  initializeForm() {
    this.batchTransferForm = this.fb.group({
      gadgetCountSummary: [{ value: '', disabled: true }],
      ownerId: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }, Validators.required],
      transferTo: ['', Validators.required],
      gadgetIds: [[]] // This will hold the IDs of selected gadgets
    });
  }

  fetchGadgets(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any[]>('https://gadget-backend.onrender.com/api/gadgets/view', { headers })
      .subscribe(
        data => {
          this.gadgets = data.map(gadget => ({ ...gadget, selected: false })); // Initialize 'selected' property
        },
        error => {
          console.error('Error fetching gadgets', error);
        }
      );
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  filteredGadgets() {
    const query = this.searchQuery.toLowerCase();
    return this.gadgets.filter(gadget =>
      (gadget.model && gadget.model.toLowerCase().includes(query)) ||
      (gadget.type && gadget.type.toLowerCase().includes(query)) ||
      (gadget.serialNumber && gadget.serialNumber.toLowerCase().includes(query)) ||
      (gadget.imei && gadget.imei.toLowerCase().includes(query)) ||
      (gadget.storageSize && gadget.storageSize.toLowerCase().includes(query)) ||
      (gadget.ram && gadget.ram.toLowerCase().includes(query)) ||
      (gadget.color && gadget.color.toLowerCase().includes(query)) ||
      (gadget.registrationDate && gadget.registrationDate.toLowerCase().includes(query))
    ).filter(gadget => gadget.type === this.selectedTab);
  }

  toggleAllGadgets(event: any): void {
    const isChecked = event.target.checked;
    this.filteredGadgets().forEach(gadget => {
      gadget.selected = isChecked;
    });
  }

  openTransferModal(): void {
    this.prepareFormForModal(); // Populate the form before showing the modal
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  prepareFormForModal(): void {
    const selectedGadgets = this.gadgets.filter(gadget => gadget.selected);

    // Calculate the number of laptops and phones selected
    const laptopCount = selectedGadgets.filter(gadget => gadget.type === 'laptop').length;
    const phoneCount = selectedGadgets.filter(gadget => gadget.type === 'phone').length;
    const totalCount = laptopCount + phoneCount;
    const gadgetCountSummary = `Laptops: ${laptopCount}, Phones: ${phoneCount}, Total: ${totalCount}`;

    // Extract owner details from token (assuming it's stored in the token payload)
    const tokenData = JSON.parse(atob(this.token.split('.')[1]));
    const ownerName = tokenData.fullName || '';
    const ownerId = tokenData.tin || tokenData.brn || '';
    const phoneNumber = tokenData.phoneNumber || '';

    this.batchTransferForm.patchValue({
      gadgetCountSummary,
      ownerId,
      phoneNumber,
      gadgetIds: selectedGadgets.map(gadget => gadget._id) // Capture the gadget IDs
    });
  }

  onSubmitBatchTransfer(): void {
    if (this.batchTransferForm.valid) {
      const formData = this.batchTransferForm.getRawValue(); // Get form data
      console.log('Form Data:', formData); // Log form data (this can be removed in production)
      this.http.post('https://gadget-backend.onrender.com/api/transfer/batch', formData, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`
        })
      }).subscribe(
        response => {
          alert('Gadgets transferred successfully!');
          this.closeModal(); // Close modal on success
        },
        error => {
          console.error('Error transferring gadgets:', error);
          alert('An error occurred during transfer.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
}
