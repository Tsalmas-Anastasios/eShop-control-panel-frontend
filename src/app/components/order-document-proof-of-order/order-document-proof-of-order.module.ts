import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OrderDocumentProofOfOrderComponent } from './order-document-proof-of-order.component';
import { PrintableDocumentsFooterModule } from '../printable-documents-footer/printable-documents-footer.module';



@NgModule({
  declarations: [
    OrderDocumentProofOfOrderComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PrintableDocumentsFooterModule,
  ],
  exports: [
    OrderDocumentProofOfOrderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderDocumentProofOfOrderModule { }
