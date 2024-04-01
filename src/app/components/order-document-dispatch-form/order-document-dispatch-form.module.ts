import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { OrderDocumentDispatchFormComponent } from './order-document-dispatch-form.component';
import { PrintableDocumentsFooterModule } from '../printable-documents-footer/printable-documents-footer.module';



@NgModule({
  declarations: [
    OrderDocumentDispatchFormComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PrintableDocumentsFooterModule
  ],
  exports: [
    OrderDocumentDispatchFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderDocumentDispatchFormModule { }
