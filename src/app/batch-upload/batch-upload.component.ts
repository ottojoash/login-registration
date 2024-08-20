import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent {
  selectedFile: File | null = null;
  headers: string[] = [];
  data: any[] = [];

  constructor(private http: HttpClient) {} // Inject HttpClient

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.readFile(this.selectedFile);
    }
  }

  readFile(file: File): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const binaryStr: string = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });

      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.headers = data[0] as string[]; // First row as headers
      this.data = data.slice(1).map(row => {
        return {
          model: row[this.headers.indexOf('Model')],
          serialNumber: row[this.headers.indexOf('Serial Number')],
          deviceId: row[this.headers.indexOf('Device ID')],
          color: row[this.headers.indexOf('Color')],
          registrationDate: this.parseDate(row[this.headers.indexOf('Registration Date')]), // Adjusted date handling
          storageSize: row[this.headers.indexOf('Storage Size')],
          ram: row[this.headers.indexOf('RAM')],
          type: (row[this.headers.indexOf('Type')] || '').toLowerCase(), // Ensure type is lowercase
          brand: row[this.headers.indexOf('Brand')],
          description: row[this.headers.indexOf('Description')],
          purchaseLocation: row[this.headers.indexOf('Purchase Location')],
          imei: row[this.headers.indexOf('IMEI')],
          simType: row[this.headers.indexOf('SIM Type')],
          phoneNumber: row[this.headers.indexOf('Phone Number')],
          network: row[this.headers.indexOf('Network Type')]
        };
      });
    };
    reader.readAsBinaryString(file);
  }

  // Simplified date parsing to just return the date string if it's valid
  parseDate(excelDate: any): string | null {
    if (!excelDate) return null;

    // If the date is already a valid ISO string, just return it
    const date = new Date(excelDate);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }

    // If not, log a warning and return null
    console.warn('Invalid date value:', excelDate);
    return null;
  }

  downloadTemplate(): void {
    const headers = [
      'Model', 'Serial Number', 'Device ID', 'Color', 'Registration Date', 
      'Storage Size', 'RAM', 'Device Type', 
      'Brand', 'Description', 'Purchase Location', 'IMEI', 'SIM Type', 
      'Phone Number', 'Network Type', 'Type'
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gadgets');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Gadget_Registration_Template.xlsx');
  }

  registerGadgets(): void {
    if (this.data.length > 0) {
      const url = 'http://localhost:5000/api/gadgets/register';

      // Retrieve the token from local storage or another secure location
      const token = localStorage.getItem('authToken');

      // Prepare the headers with the token
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Validate and sanitize data before sending
      const sanitizedData = this.data.map(gadget => {
        return {
          model: gadget.model || '',
          serialNumber: gadget.serialNumber || '',
          deviceId: gadget.deviceId || '',
          color: gadget.color || '',
          registrationDate: gadget.registrationDate || new Date().toISOString(), // Use current date if not provided
          storageSize: gadget.storageSize || '', // Ensure storage size is included
          ram: gadget.ram || '',
          type: (gadget.type || '').toLowerCase(),
          brand: gadget.brand || '',
          description: gadget.description || '',
          purchaseLocation: gadget.purchaseLocation || '',
          imei: gadget.imei || '',
          simType: gadget.simType || '',
          phoneNumber: gadget.phoneNumber || '',
          network: gadget.network || ''
        };
      });

      this.http.post(url, sanitizedData, { headers })
        .subscribe(
          response => {
            console.log('Gadgets registered successfully', response);
            // Add any additional logic you need here, like showing a success message
          },
          error => {
            console.error('Failed to register gadgets', error);
            // Add error handling logic here
          }
        );
    } else {
      console.warn('No data to register');
      // Optionally, show a warning message to the user
    }
  }
}
