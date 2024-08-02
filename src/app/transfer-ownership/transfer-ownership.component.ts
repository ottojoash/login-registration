import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent {
  selectedTab: string = 'batch';
  searchQuery: string = '';
  searchInput$ = new Subject<string>();
  gadgetList: any[] = [];
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

  constructor(private http: HttpClient) {
    this.searchInput$
      .pipe(
        debounceTime(300),
        switchMap(value => this.fetchGadgets(value)),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe(data => this.gadgetList = data);
  }

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

  fetchGadgets(query: string) {
    if (!query) {
      return of([]);
    }
    return this.http.get<any[]>(`http://localhost:5000/api/gadgets/search?query=${query}`);
  }

  selectGadget(gadget: any) {
    this.gadget = {
      name: gadget.model,
      type: gadget.type,
      sn: gadget.sn,
      imei: gadget.imei,
      storage: gadget.storage,
      ram: gadget.ram,
      color: gadget.color,
      year: gadget.year
    };
    this.gadgetList = [];
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput$.next(input.value);
  }

  onSubmit() {
    if (this.gadget.name && this.gadget.type && this.gadget.sn && this.gadget.imei) {
      this.http.post('http://localhost:5000/api/ownership-transfer', this.gadget)
        .subscribe(
          response => {
            alert('Ownership transferred successfully');
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
          },
          (error: HttpErrorResponse) => {
            console.error('Error transferring ownership', error);
            alert('An error occurred while transferring ownership');
          }
        );
    } else {
      alert('Please fill in all required fields');
    }
  }
}
