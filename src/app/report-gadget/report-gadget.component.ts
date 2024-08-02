import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-report-gadget',
  templateUrl: './report-gadget.component.html',
  styleUrls: ['./report-gadget.component.scss']
})
export class ReportGadgetComponent implements OnInit {
  reportForm: FormGroup;
  searchInput$ = new Subject<string>();
  gadgetList: any[] = [];

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.reportForm = this.fb.group({
      gadgetIdentifier: ['', Validators.required],
      gadgetName: [''],
      gadgetBrand: [''],
      dateLastSeen: ['', Validators.required],
      locationLastSeen: ['', Validators.required],
      contactInformation: ['', Validators.required],
      gadgetColor: [''],
      personReporting: ['', Validators.required],
      description: ['', Validators.required],
      reportDate: ['', Validators.required],
      comments: ['']
    });

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

  ngOnInit(): void {
    this.reportForm.get('gadgetIdentifier')?.valueChanges.subscribe(value => {
      this.searchInput$.next(value);
    });
  }

  fetchGadgets(query: string) {
    if (!query) {
      return of([]);
    }
    return this.http.get<any[]>(`http://localhost:5000/api/gadgets/search?query=${query}`);
  }

  selectGadget(gadget: any) {
    this.reportForm.patchValue({
      gadgetIdentifier: gadget.identifier,
      gadgetName: gadget.model,
      gadgetBrand: gadget.brand,
      gadgetColor: gadget.color
    });
    this.gadgetList = [];
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchInput$.next(input.value);
  }

  onSubmit() {
    if (this.reportForm.valid) {
      this.http.post('http://localhost:5000/api/reports', this.reportForm.getRawValue())
        .subscribe(
          response => {
            alert('Report submitted successfully');
            this.reportForm.reset();
          },
          (error: HttpErrorResponse) => {
            console.error('Error submitting report', error);
            alert('An error occurred while submitting the report');
          }
        );
    } else {
      alert('Please fill in all required fields');
    }
  }
}
