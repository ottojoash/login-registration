import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-gadgets',
  templateUrl: './view-gadgets.component.html',
  styleUrls: ['./view-gadgets.component.scss']
})
export class ViewGadgetsComponent implements OnInit {
  searchQuery: string = '';
  gadgets: any[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchGadgets();
  }

  fetchGadgets(): void {
    this.http.get<any[]>('http://localhost:5000/api/gadgets/view')
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
    );
  }
}
