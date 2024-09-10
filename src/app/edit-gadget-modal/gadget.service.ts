import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GadgetService {
  private apiUrl = 'http://localhost:3000/gadgets'; // Your backend API endpoint

  constructor(private http: HttpClient) {}

  // Update a gadget by its ID
  updateGadget(id: string, gadget: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, gadget);
  }
}
