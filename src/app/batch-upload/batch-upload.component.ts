import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-batch-upload',
  templateUrl: './batch-upload.component.html',
  styleUrls: ['./batch-upload.component.scss']
})
export class BatchUploadComponent {
  selectedFile: File | null = null;
  notificationVisible: boolean = false;
  notificationMessage: string = '';
  selectedTab: string = 'Laptops';

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Handle file upload logic here if needed
    }
  }

  downloadTemplate(): void {
    // Define headers for the Excel file
    const headers = [
      'Model', 'Brand', 'Serial Number', 'Color', 'Description', 'Purchase Location', 
      'Registration Date', 'Storage Size', 'RAM', 'Device ID', 'IMEI', 'SIM Type', 
      'Phone Number', 'Network Type', 'Type'
    ];

    // Create a worksheet and workbook
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gadgets');

    // Convert workbook to binary array
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Create a Blob from the binary array and save it as a file
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Gadget_Registration_Template.xlsx');
  }
}
