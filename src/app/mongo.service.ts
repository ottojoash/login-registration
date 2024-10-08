import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MongoService {

  private apiUrl = 'https://gadget-backend.onrender.com/api'; // Adjust the base URL as needed

  constructor(private http: HttpClient) { }

  register(registerData: {
    fullName: string;
    email: string;
    address: string;
    phoneNumber: string;
    brn: string;
    tin: string;
    password: string;
    category: string; // Added category parameter
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, registerData).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred!';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      console.error('Client-side error:', error.error.message);
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      console.error(`Backend returned code ${error.status}, body was: ${JSON.stringify(error.error)}`);
      errorMessage = `Backend error: ${error.status} - ${this.extractErrorMessage(error.error)}`;
    }

    // Return an observable with a user-facing error message
    return throwError(() => new Error(errorMessage));
  }

  private extractErrorMessage(errorObj: any): string {
    // Extracts a readable error message from the error object
    if (errorObj && typeof errorObj === 'object') {
      return Object.values(errorObj).join(' '); // Join all values into a single string
    }
    return 'Unknown error';
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
  // handleError(handleError: any): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  
}
