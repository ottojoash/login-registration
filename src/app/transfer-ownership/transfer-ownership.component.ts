import { Component } from '@angular/core';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent {
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
  
  gadgets = [
    // Sample data; replace with actual data
    { name: 'Sample Gadget', type: 'Laptop', sn: '123456789', imei: '9876543210', storage: '256GB', ram: '16GB', color: 'Black', year: '2021' },
    // Add more gadgets here
  ];

  selectTab(tab: string) {
    this.selectedTab = tab;
  }

  filteredGadgets() {
    return this.gadgets.filter(gadget =>
      gadget.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.type.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.sn.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.imei.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.storage.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.ram.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.color.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      gadget.year.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onSubmit() {
    // Handle form submission
  }
}
