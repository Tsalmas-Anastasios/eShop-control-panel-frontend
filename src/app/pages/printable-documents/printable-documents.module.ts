import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintableDocumentsRoutingModule } from './printable-documents-routing.module';
import { OrderPapersModule } from './order-papers/order-papers.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    PrintableDocumentsRoutingModule,
    OrderPapersModule,
  ],
  exports: [
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrintableDocumentsModule { }
