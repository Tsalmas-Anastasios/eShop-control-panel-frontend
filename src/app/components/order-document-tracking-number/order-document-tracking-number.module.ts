import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDocumentTrackingNumberComponent } from './order-document-tracking-number.component';
import { PrintableDocumentsFooterModule } from '../printable-documents-footer/printable-documents-footer.module';



@NgModule({
  declarations: [
    OrderDocumentTrackingNumberComponent
  ],
  imports: [
    CommonModule,
    PrintableDocumentsFooterModule
  ],
  exports: [
    OrderDocumentTrackingNumberComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderDocumentTrackingNumberModule { }
