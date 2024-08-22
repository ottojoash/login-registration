import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
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
  showGadgetList: boolean = false;
  searchQuery: any;
  notificationVisible: boolean = false;
  notificationMessage: string = '';
  notificationType: 'success' | 'error' | 'warning' = 'success';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.transferForm = this.fb.group({
      gadgetType: ['', Validators.required],
      gadgetModel: [''],
      imei: [''],
      serialNumber: ['', Validators.required],
      ownerId: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: [{ value: '', disabled: true }],
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
        this.showGadgetList = true;
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
        const tokenData = JSON.parse(atob(token.split('.')[1]));
        const { phoneNumber, tin, brn } = tokenData;

        this.transferForm.patchValue({
          phoneNumber,
          ownerId: tin || brn
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
    return this.http.get<any[]>(`https://gadget-backend.onrender.com/api/reports/search?query=${query}`, {
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
      this.http.put('https://gadget-backend.onrender.com/api/transfer/piece', this.transferForm.getRawValue(), {
        headers: this.getAuthHeaders()
      })
      .subscribe(
        response => {
          this.showNotification('Ownership transferred successfully', 'success');
          this.transferForm.reset();
        },
        (error: HttpErrorResponse) => {
          console.error('Error transferring ownership', error);
          this.showNotification('An error occurred while transferring ownership', 'error');
        }
      );
    } else {
      this.showNotification('Please fill in all required fields', 'warning');
    }
  }

  showNotification(message: string, type: 'success' | 'error' | 'warning'): void {
    this.notificationMessage = message;
    this.notificationType = type;
    this.notificationVisible = true;
    setTimeout(() => {
      this.notificationVisible = false;
    }, 3000);
  }

  closeNotification(): void {
    this.notificationVisible = false;
  }

  navigateToBatchTransfer(): void {
    this.router.navigate(['/home/batch-transfer-ownership']);
  }
}
