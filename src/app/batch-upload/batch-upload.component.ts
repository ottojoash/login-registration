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
  headers: string[] = []; // Array to store the headers from the file
  data: any[] = []; // Array to store the data from the file

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

      // Extract headers and data
      this.headers = data[0] as string[]; // First row as headers
      this.data = data.slice(1); // Remaining rows as data
    };
    reader.readAsBinaryString(file);
  }

  downloadTemplate(): void {
    const headers = [
      'Model', 'Serial Number', 'Device ID', 'Color', 'Registration Date', 
      'Storage Size', 'RAM', 'Device Type', // These are the first headers you provided
      'Brand', 'Description', 'Purchase Location', 'IMEI', 'SIM Type', 
      'Phone Number', 'Network Type', 'Type' // These are the remaining headers
    ];

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Gadgets');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, 'Gadget_Registration_Template.xlsx');
}
}
