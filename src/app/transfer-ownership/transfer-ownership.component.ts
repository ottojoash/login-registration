import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent implements OnInit {
  selectedTab: string = 'batch';
  searchQuery: string = '';
  gadget = {
    name: '',
    type: '',
    sn: '',
    imei: '',
    storage: '',
    ram: '',
    color: '',
    year: ''
  };

  gadgets: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchGadgets();
  }

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  fetchGadgets(): void {
    this.http.get<any[]>('http://localhost:5000/api/gadgets/view') // Adjust the URL to match your backend endpoint
      .subscribe(
        data => {
          this.gadgets = data;
        },
        error => {
          console.error('Error fetching gadgets', error);
        }
      );
  }

  filteredGadgets() {
    return this.gadgets.filter(gadget =>
      (gadget.name || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.type || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.sn || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.imei || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.storage || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.ram || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.color || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      (gadget.year || '').toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
  

  onSubmit() {
    // Handle form submission
    this.http.post('http://localhost:5000/api/gadgets/transfer/piece', this.gadget) // Adjust the URL to match your backend endpoint
      .subscribe(
        response => {
          console.log('Gadget transferred successfully', response);
          this.resetForm();
          this.fetchGadgets();
        },
        error => {
          console.error('Error transferring gadget', error);
        }
      );
  }

  resetForm() {
    this.gadget = {
      name: '',
      type: '',
      sn: '',
      imei: '',
      storage: '',
      ram: '',
      color: '',
      year: ''
    };
  }
}
