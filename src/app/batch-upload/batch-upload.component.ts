import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';  // Import the Router service

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent {
  selectedFile: File | null = null;
  headers: string[] = [];
  data: any[] = [];
  isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private router: Router,  // Inject the Router service
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId); // Check if running in browser
  }

  onFileChange(event: Event): void {
    if (this.isBrowser) {
      const input = event.target as HTMLInputElement;
      if (input.files && input.files.length > 0) {
        this.selectedFile = input.files[0];
        this.readFile(this.selectedFile);
      }
    } else {
      console.error('File handling is not supported in this environment.');
    }
  }

  async readFile(file: File): Promise<void> {
    if (this.isBrowser) {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const data: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        this.headers = data[0] as string[]; // First row as headers
        this.data = data.slice(1).map(row => {
          const type = (row[this.headers.indexOf('Type')] || '').toLowerCase();
          const commonFields = {
            type,
            model: row[this.headers.indexOf('Model')],
            brand: row[this.headers.indexOf('Brand')],
            serialNumber: row[this.headers.indexOf('Serial Number')],
            description: row[this.headers.indexOf('Description')],
            purchaseLocation: row[this.headers.indexOf('Purchase Location')],
            registrationDate: this.parseDate(row[this.headers.indexOf('Registration Date')]),
            storageSize: row[this.headers.indexOf('Storage Size')],
            color: row[this.headers.indexOf('Color')]
          };

          if (type === 'phone') {
            return {
              ...commonFields,
              imei: row[this.headers.indexOf('IMEI')] || null,
              simType: row[this.headers.indexOf('SIM Type')] || null,
              phoneNumber: row[this.headers.indexOf('Phone Number')] || null,
              network: row[this.headers.indexOf('Network')] || null
            };
          } else if (type === 'laptop') {
            return {
              ...commonFields,
              deviceId: row[this.headers.indexOf('Device ID')] || null,
              ram: row[this.headers.indexOf('RAM')] || null
            };
          } else {
            console.warn('Unknown type:', type);
            return null;
          }
        }).filter(item => item !== null); // Filter out null items

        // Log the parsed data
        console.log('Parsed Data:', JSON.stringify(this.data, null, 2));

      } catch (error) {
        console.error('Failed to read the file', error);
      }
    } else {
      console.error('File reading is not supported in this environment.');
    }
  }

  parseDate(excelDate: any): string | null {
    if (!excelDate) return null;

    const date = new Date(excelDate);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }

    console.warn('Invalid date value:', excelDate);
    return null;
  }

  downloadTemplate(): void {
    const headers = [
      'Model', 'Serial Number', 'Device ID', 'Color', 'Registration Date',
      'Storage Size', 'RAM', 'Type',
      'Brand', 'Description', 'Purchase Location', 'IMEI', 'SIM Type',
      'Phone Number', 'Network'
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
      const url = 'https://gadget-backend.onrender.com/api/gadgets/batch-register';

      const token = localStorage.getItem('authToken');

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });

      const sanitizedData = this.data.map(gadget => {
        const { type, ...commonFields } = gadget;

        let specificFields = {};
        if (type === 'phone') {
          specificFields = {
            imei: gadget.imei,  // IMEI required for phones
            simType: gadget.simType,  // SIM Type required for phones
            phoneNumber: gadget.phoneNumber,  // Phone number required for phones
            network: gadget.network  // Network required for phones
          };
        } else if (type === 'laptop') {
          specificFields = {
            deviceId: gadget.deviceId,  // Device ID required for laptops
            ram: gadget.ram  // RAM required for laptops
          };
        }

        // Ensure all common fields are provided, even as null
        return {
          type,
          model: commonFields.model || null,
          brand: commonFields.brand || null,
          serialNumber: commonFields.serialNumber || null,
          description: commonFields.description || null,
          purchaseLocation: commonFields.purchaseLocation || null,
          registrationDate: commonFields.registrationDate || null,
          storageSize: commonFields.storageSize || null,
          color: commonFields.color || null,
          ...specificFields
        };
      });

      // Log the sanitized data before sending it to the server
      console.log('Sanitized Data Being Sent:', JSON.stringify(sanitizedData, null, 2));

      this.http.post(url, sanitizedData, { headers })
        .subscribe(
          response => {
            console.log('Gadgets registered successfully', response);
            this.router.navigate(['/home/view-gadgets']);  // Navigate to the "View Gadgets" page
          },
          error => {
            console.error('Failed to register gadgets:', error);
            if (error.status === 400) {
              console.error('Bad Request: Please check the data format.');
              console.error('Error details:', error.error); // Log the specific error details from the backend
            }
          }
        );
    } else {
      console.warn('No data to register');
    }
  }
}
