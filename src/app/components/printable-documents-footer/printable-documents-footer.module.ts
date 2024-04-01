import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintableDocumentsFooterComponent } from './printable-documents-footer.component';



@NgModule({
  declarations: [
    PrintableDocumentsFooterComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    PrintableDocumentsFooterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PrintableDocumentsFooterModule { }
