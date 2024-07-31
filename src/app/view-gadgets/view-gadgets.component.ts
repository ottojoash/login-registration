import { Component } from '@angular/core';

@Component({
  selector: 'app-view-gadgets',
  templateUrl: './view-gadgets.component.html',
  styleUrls: ['./view-gadgets.component.scss']
})
export class ViewGadgetsComponent {
  searchQuery: string = '';
  gadgets = [
    // Sample data; replace with actual data
    { name: 'Sample Gadget', type: 'Laptop', sn: '123456789', imei: '9876543210', storage: '256GB', ram: '16GB', color: 'Black', year: '2021' },
    // Add more gadgets here
  ];

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
}
