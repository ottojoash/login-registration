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
  selectedTab: string = 'laptop'; // Default tab
  page: number = 1; // Current page for pagination
  private token: string = ''; // Assume token is retrieved and set from a service
  isModalOpen: boolean = false; 
  selectedGadget: any = null; 

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
    this.page = 1; // Reset to the first page when tab changes
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

  openEditModal(gadget: any): void {
    this.selectedGadget = gadget;
    this.isModalOpen = true;
  }
  
  closeEditModal(): void {
    this.isModalOpen = false;
    this.selectedGadget = null;
  }
  
  handleSave(updatedGadget: any): void {
    if (updatedGadget) {
      // Update the gadget in the local list
      const index = this.gadgets.findIndex(g => g.id === updatedGadget.id);
      if (index !== -1) {
        this.gadgets[index] = updatedGadget;
      }
  
      // Optionally, send an update request to the backend
      this.http.put(`https://gadget-backend.onrender.com/api/gadgets/${updatedGadget.id}`, updatedGadget, {
        headers: new HttpHeaders({
          'Authorization': `Bearer ${this.token}`
        })
      }).subscribe(
        response => console.log('Update successful', response),
        error => console.error('Error updating gadget', error)
      );
    }
    this.closeEditModal(); // Close the modal after saving
  }
  
}
