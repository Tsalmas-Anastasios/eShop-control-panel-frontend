import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrintComponent } from './print.component';
import { RouterModule } from '@angular/router';
import { NgxSpinnerModule } from 'ngx-spinner';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    PrintComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgxSpinnerModule,
    TranslateModule,
  ],
  exports: [
    PrintComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PrintModule { }
