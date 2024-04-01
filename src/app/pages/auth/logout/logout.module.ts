import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './logout.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';



@NgModule({
  declarations: [
    LogoutComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
  ],
  exports: [
    LogoutComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LogoutModule { }
