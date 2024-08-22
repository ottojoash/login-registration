import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-view-gadgets',
  templateUrl: './view-gadgets.component.html',
  styleUrls: ['./view-gadgets.component.scss']
})
export class ViewGadgetsComponent implements OnInit {
  searchQuery: string = '';
  gadgets: any[] = [];
  filteredGadgetsList: any[] = [];
  selectedTab: string = 'laptop'; // Default tab
  private token: string = ''; // Assume token is retrieved and set from a service

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    // Retrieve token from a service or storage
    this.token = localStorage.getItem('authToken') || ''; // or however you store the token
    this.fetchGadgets();
  }

  fetchGadgets(): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    this.http.get<any[]>('https://gadget-backend.onrender.com/api/gadgets/view', { headers })
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
