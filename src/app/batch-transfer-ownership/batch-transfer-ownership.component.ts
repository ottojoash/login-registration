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

  constructor(private http: HttpClient) { }

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
          this.gadgets = data;
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
}
