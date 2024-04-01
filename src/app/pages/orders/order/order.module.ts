import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderComponent } from './order.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { StatusDropdownCustomModuleModule } from '../../../modules/status-dropdown-custom-module/status-dropdown-custom-module.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { LaddaModule } from 'angular2-ladda';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPrintModule } from 'ngx-print';
import { RequiredFieldModule } from '../../../modules/required-field/required-field.module';
import { OrderDocumentReceiptInvoiceModule } from '../../../components/order-document-receipt-invoice/order-document-receipt-invoice.module';
import { OrderDocumentDispatchFormModule } from '../../../components/order-document-dispatch-form/order-document-dispatch-form.module';
import { OrderDocumentProofOfOrderModule } from '../../../components/order-document-proof-of-order/order-document-proof-of-order.module';
import { OrderDocumentTrackingNumberModule } from '../../../components/order-document-tracking-number/order-document-tracking-number.module';


@NgModule({
  declarations: [
    OrderComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    RouterModule,
    NgxSpinnerModule,
    StatusDropdownCustomModuleModule,
    CKEditorModule,
    NgxPrintModule,
    RequiredFieldModule,
    LaddaModule,
    NgSelectModule,
    OrderDocumentReceiptInvoiceModule,
    OrderDocumentDispatchFormModule,
    OrderDocumentProofOfOrderModule,
    OrderDocumentTrackingNumberModule,
  ],
  exports: [
    OrderComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule { }
