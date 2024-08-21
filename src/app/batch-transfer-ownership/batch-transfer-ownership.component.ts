import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-batch-transfer-ownership',
  templateUrl: './batch-transfer-ownership.component.html',
  styleUrls: ['./batch-transfer-ownership.component.scss']
})
export class BatchTransferOwnershipComponent implements OnInit {
  searchQuery: string = '';
  gadgets: any[] = [];
  selectedTab: string = 'laptop'; // Default tab
  private token: string = ''; // Assume token is retrieved and set from a service

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('authToken') || ''; // Retrieve token
    this.fetchGadgets();
  }

  fetchGadgets(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any[]>('http://localhost:5000/api/gadgets/view', { headers })
      .subscribe(
        data => {
          // Initialize 'selected' property for each gadget
          this.gadgets = data.map(gadget => ({ ...gadget, selected: false }));
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

  onTransfer(): void {
    const selectedGadgets = this.gadgets.filter(gadget => gadget.selected);
    if (selectedGadgets.length > 0) {
      // Implement the transfer logic here
      console.log('Gadgets to transfer:', selectedGadgets);
      // Example: You can send a request to the backend to process the transfer
      this.http.post('http://localhost:5000/api/transfer/batch', selectedGadgets, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        })
      })
      .subscribe(
        response => {
          alert('Ownership transferred successfully');
          console.log('Transfer response:', response);
          // Optionally, you could reset the gadgets' selection or refresh the list
          this.gadgets.forEach(gadget => gadget.selected = false);
        },
        error => {
          console.error('Error transferring ownership', error);
          alert('An error occurred while transferring ownership');
        }
      );
    } else {
      alert('Please select at least one gadget to transfer.');
    }
  }
}
