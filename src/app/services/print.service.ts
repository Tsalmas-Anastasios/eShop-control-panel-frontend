import { PrintableDocumentsModule } from './../pages/printable-documents/printable-documents.module';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PrintService {

  public isPrinting = false;

  constructor(
    private router: Router
  ) { }



  printDocument(documentName: string, documentData: any): void {

    this.isPrinting = true;

    if (typeof documentData === 'number')
      documentData = documentData.toString();
    else if (typeof documentData === 'object')
      documentData = JSON.stringify(documentData);


    this.router.navigate([
      {
        outlets: {
          print: ['print', documentName, documentData]
        }
      }
    ]);
  }




  onDataReady(): void {

    setTimeout(() => {
      window.print();
      this.isPrinting = false;
      this.router.navigate([{ outlets: { print: null } }]);
    });

  }


}
