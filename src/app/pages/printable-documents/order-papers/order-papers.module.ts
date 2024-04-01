import { OrderDocumentProofOfOrderModule } from './../../../components/order-document-proof-of-order/order-document-proof-of-order.module';
import { OrderDocumentReceiptInvoiceModule } from './../../../components/order-document-receipt-invoice/order-document-receipt-invoice.module';
import { OrderDocumentDispatchFormModule } from './../../../components/order-document-dispatch-form/order-document-dispatch-form.module';
import { OrderDocumentTrackingNumberModule } from './../../../components/order-document-tracking-number/order-document-tracking-number.module';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPapersComponent } from './order-papers.component';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    OrderPapersComponent
  ],
  imports: [
    CommonModule,
    NgxSpinnerModule,
    OrderDocumentReceiptInvoiceModule,
    OrderDocumentProofOfOrderModule,
    OrderDocumentDispatchFormModule,
    OrderDocumentTrackingNumberModule
  ],
  exports: [
    OrderPapersComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPapersModule { }
