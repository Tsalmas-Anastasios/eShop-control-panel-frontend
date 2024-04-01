import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDocumentReceiptInvoiceComponent } from './order-document-receipt-invoice.component';
import { TranslateModule } from '@ngx-translate/core';
import { PrintableDocumentsFooterModule } from '../printable-documents-footer/printable-documents-footer.module';



@NgModule({
  declarations: [
    OrderDocumentReceiptInvoiceComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PrintableDocumentsFooterModule
  ],
  exports: [
    OrderDocumentReceiptInvoiceComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderDocumentReceiptInvoiceModule { }
