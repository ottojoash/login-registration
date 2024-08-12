import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MongoService {

  private apiUrl = 'http://localhost:5000/api'; // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  register(fullName: string, email: string, address: string, phoneNumber: string, brn: string, tin: string, password: string): Observable<any> {
    const registerData = { fullName, email, address, phoneNumber, brn, tin, password };
    return this.http.post(`${this.apiUrl}/auth/register`, registerData).pipe(
      catchError(this.handleError)
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password }).pipe(
      tap((response: { token: string; }) => {
        // Save the token to local storage
        localStorage.setItem('token', response.token);
      }),
      catchError(error => {
        return throwError(error);
      })
    );
  }

  addGadget(gadget: any): Promise<any> {
    const token = localStorage.getItem('token'); // Adjust token retrieval as needed

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/gadgets/register`, gadget, { headers })
      .toPromise()
      .catch(this.handleError);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Check if token exists in local storage
  }

  getUser(): Observable<any> {
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/auth/current-user`, { headers }).pipe(
      catchError(this.handleError)
    );
  }

   // Method to upload CSV
   uploadCSV(file: File): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/upload-csv`, formData, { headers })
      .toPromise()
      .catch(this.handleError);
  }

  // Updated addGadget to include the owner field
  addGadgetWithOwner(gadget: any): Promise<any> {
    return this.getUser().toPromise().then((user: any) => {
      console.log('Retrieved User:', user); // Debugging: Log the user data
      if (user && user._id) {
        gadget.owner = user._id; // Ensure the owner is correctly assigned
        return this.addGadget(gadget);
      } else {
        throw new Error('User ID is missing');
      }
    }).catch(this.handleError);
  }
  handleError(handleError: any): Promise<any> {
    throw new Error('Method not implemented.');
  }
  
}
