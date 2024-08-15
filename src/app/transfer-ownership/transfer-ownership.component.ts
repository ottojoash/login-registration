import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-transfer-ownership',
  templateUrl: './transfer-ownership.component.html',
  styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent implements OnInit {
  transferForm: FormGroup;
  searchInput$ = new Subject<string>();
  gadgetList: any[] = [];
  showGadgetList: boolean = false; // Visibility for gadget dropdown
  searchQuery: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.transferForm = this.fb.group({
      gadgetType: ['', Validators.required],
      gadgetModel: [''],
      imei: [''],
      serialNumber: ['', Validators.required],
      ownerId: [{ value: '', disabled: true }, Validators.required], // Disabled
      phoneNumber: [{ value: '', disabled: true }], // Disabled
      storage: ['', Validators.required],
      transferTo: ['', Validators.required],
      transferDetails: ['', Validators.required]
    });

    // Handle search input for gadgets
    this.searchInput$
      .pipe(
        debounceTime(300),
        switchMap(value => this.fetchGadgets(value)),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.gadgetList = data;
        this.showGadgetList = true; // Show gadget list
      });
  }

  ngOnInit(): void {
    this.setInitialOwnerDetails();

    this.transferForm.get('gadgetType')?.valueChanges.subscribe(value => {
      this.searchInput$.next(value);
    });
  }

  setInitialOwnerDetails() {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode token payload
        const { phoneNumber, tin, brn } = tokenData; // Extract necessary fields

        this.transferForm.patchValue({
          phoneNumber, // Set phone number field
          ownerId: tin || brn // Set TIN or BRN; choose the non-empty value
        });
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  fetchGadgets(query: string) {
    if (!query) {
      return of([]);
    }
    return this.http.get<any[]>(`http://localhost:5000/api/reports/search?query=${query}`, {
      headers: this.getAuthHeaders()
    });
  }

  selectGadget(gadget: any) {
    this.transferForm.patchValue({
        gadgetType: gadget.type,
        gadgetModel: gadget.model,
        imei: gadget.imei,
        serialNumber: gadget.serialNumber,
        storage: gadget.storageSize
    });
    this.gadgetList = [];
    this.showGadgetList = false;
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput$.next(input.value);
  }

  onSubmit() {
    if (this.transferForm.valid) {
      this.http.put('http://localhost:5000/api/transfer/piece', this.transferForm.getRawValue(), {
        headers: this.getAuthHeaders()
      })
      .subscribe(
        response => {
          alert('Ownership transferred successfully');
          this.transferForm.reset();
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
