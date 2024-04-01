import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPreviewComponent } from './order-preview.component';
import { StatusDropdownCustomModuleModule } from '../../../modules/status-dropdown-custom-module/status-dropdown-custom-module.module';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    OrderPreviewComponent
  ],
  imports: [
    CommonModule,
    StatusDropdownCustomModuleModule,
    TranslateModule
  ],
  exports: [
    OrderPreviewComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderPreviewModule { }
