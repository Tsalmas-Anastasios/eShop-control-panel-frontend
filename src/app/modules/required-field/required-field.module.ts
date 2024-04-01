import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequiredFieldComponent } from './required-field.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    RequiredFieldComponent
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    RequiredFieldComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RequiredFieldModule { }
