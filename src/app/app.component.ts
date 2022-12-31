import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private fb: FormBuilder){}
  message = '';
  formGroup = this.fb.group({
    file: [null, Validators.required]
  });

  onFileChange(event: any) {
    const file = event?.target?.files[0] || null;
    if (file) {
      this.csvFormGroupPatch(file);
    } else {
      console.log('No File Found');
    }
  }
  /*
1 Megabyte(MB)
1 MB = 1,048,576 Byte (B)
2 MB = 2,097,152 Bytes (B)
3 MB = 3,145,728 Bytes (B)
4 MB = 4,194,304 Bytes (B)
5 MB = 5,242,880 Bytes (B)
6 MB = 6,291,456 Bytes (B)
7 MB = 7,340,032 Bytes (B)
8 MB = 8,388,608 Bytes (B)
9 MB = 9,437,184 Bytes (B)
10 MB = 10,485,760 Bytes (B)
  */

  csvFormGroupPatch(file: any) {
    if (file.size <= 1048576) {
      this.message = '';
      this.formGroup?.patchValue({ file: file });
      this.formGroup?.get('file')?.updateValueAndValidity();
      const fileToRead = file;
      const fileReader = new FileReader();
      fileReader.onload = (e: any) => {
        const csvContent = e.target.result;
        const lines = csvContent.split('\n');
        if (lines.length <= 1) {
          // Only For Header or empty file
          console.log('Only For Header or empty file');
          this.formGroup?.patchValue({ file: null });
          this.formGroup?.get('file')?.updateValueAndValidity();
        } else if (lines.length >= 2) {
          // Only For First row blank record check
          if (!lines[1].includes(',')) {
            console.log('Only For First row blank record check');
            this.formGroup?.patchValue({ file: null });
            this.formGroup?.get('file')?.updateValueAndValidity();
          }
        }
        const csvHeaders = lines[0].split(',');
        for (let index = 0; index < csvHeaders.length; index++) {
          let field = csvHeaders[index];
          const subfield = '\r';
          if (field.includes(subfield)) {
            field = field.replace(subfield, '');
            csvHeaders[index] = field;
          }
        }
      };
      fileReader.readAsText(fileToRead, 'UTF-8');
    } else {
      console.log('Large File');
      this.message = 'Please choose file size below 1 MB.';
      this.formGroup?.patchValue({ file: null });
      this.formGroup?.get('file')?.updateValueAndValidity();
      alert(this.message);
    }
  }
}
