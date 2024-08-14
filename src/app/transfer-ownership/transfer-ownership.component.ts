import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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
  transferToInput$ = new Subject<string>();
  gadgetList: any[] = [];
  ownerList: any[] = [];
  showGadgetList: boolean = false; // Visibility for gadget dropdown
  showOwnerList: boolean = false; // Visibility for owner dropdown
  searchQuery: any;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {
    this.transferForm = this.fb.group({
      gadgetIdentifier: ['', Validators.required],
      gadgetModel: [''],
      imei: [''],
      serialNumber: [''],
      ownerId: [{ value: '', disabled: true }, Validators.required],
      ownerNumber: [{ value: '', disabled: true }],
      storage: [''],
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

    // Handle search input for owners
    this.transferToInput$
      .pipe(
        debounceTime(300),
        switchMap(value => this.fetchOwners(value)),
        catchError(error => {
          console.error(error);
          return of([]);
        })
      )
      .subscribe(data => {
        this.ownerList = data;
        this.showOwnerList = true; // Show owner list
      });
  }

  ngOnInit(): void {
    this.setInitialOwnerDetails();

    this.transferForm.get('gadgetIdentifier')?.valueChanges.subscribe(value => {
      this.searchInput$.next(value);
    });

    this.transferForm.get('transferTo')?.valueChanges.subscribe(value => {
      this.transferToInput$.next(value);
    });
  }

  setInitialOwnerDetails() {
    const token = localStorage.getItem('authToken');
    if (token) {
      const tokenData = JSON.parse(atob(token.split('.')[1])); // Decode token payload
      const { ownerId, ownerNumber } = tokenData; // Extract necessary fields

      this.transferForm.patchValue({
        ownerId,
        ownerNumber
      });
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

  fetchOwners(query: string) {
    if (!query) {
      return of([]);
    }
    return this.http.get<any[]>(`http://localhost:5000/api/auth/search-users?query=${query}`, {
      headers: this.getAuthHeaders()
    });
  }

  selectGadget(gadget: any) {
    this.transferForm.patchValue({
      gadgetModel: gadget.model,
      imei: gadget.imei,
      serialNumber: gadget.serialNumber,
      storage: gadget.storageSize
    });
    this.gadgetList = []; // Clear gadget list after selection
    this.showGadgetList = false; // Hide gadget list
    this.cdr.detectChanges(); // Trigger change detection
  }

  selectOwner(owner: any) {
    this.transferForm.patchValue({
      transferTo: owner.tin // Assuming transferTo corresponds to TIN
    });
    this.ownerList = []; // Clear owner list after selection
    this.showOwnerList = false; // Hide owner list
    this.cdr.detectChanges(); // Trigger change detection
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput$.next(input.value);
  }

  onTransferToInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.transferToInput$.next(input.value);
  }

  onSubmit() {
    if (this.transferForm.valid) {
      this.http.post('http://localhost:5000/api/transfer/piece', this.transferForm.getRawValue(), {
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
