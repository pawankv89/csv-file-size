# csv-file-size
When import csv file then showing error at run time.

1 MB = 1048576; Bytes
5 MB = 5242880; Bytes

if (this.formGroup.value.file.size <= 1048576) {
      message = '';
    } else {
       message = 'File size to large';
    }
