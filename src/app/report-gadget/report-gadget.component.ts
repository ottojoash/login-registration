import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-report-gadget',
  templateUrl: './report-gadget.component.html',
  styleUrls: ['./report-gadget.component.scss']
})
export class ReportGadgetComponent implements OnInit {
  reportForm: FormGroup;
  searchInput$ = new Subject<string>();
  isGadgetIdentifierEmpty = true;

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
      .pipe(debounceTime(300))
      .subscribe(identifier => this.fetchGadgetDetails(identifier));
  }

  ngOnInit(): void {
    this.reportForm.get('gadgetIdentifier')?.valueChanges.subscribe(value => {
      this.isGadgetIdentifierEmpty = !value;
      this.searchInput$.next(value);
    });
  }

  fetchGadgetDetails(identifier: string) {
    if (identifier) {
      this.http.get<any>(`http://localhost:5000/api/gadgets/${identifier}`).subscribe(
        data => {
          this.reportForm.patchValue({
            gadgetName: data.model || '',
            gadgetBrand: data.brand || '',
            gadgetColor: data.color || '',
          });
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          if (error.status === 404) {
            alert('Gadget not found');
          } else {
            alert('An error occurred while fetching gadget details');
          }
        }
      );
    } else {
      this.resetAutoFilledFields();
    }
  }

  resetAutoFilledFields() {
    this.reportForm.patchValue({
      gadgetName: '',
      gadgetBrand: '',
      gadgetColor: ''
    });
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
