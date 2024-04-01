import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NbAlertModule, NbSpinnerModule } from '@nebular/theme';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { CashRegisterComponent } from './cash-register.component';
import { RequiredFieldModule } from '../../modules/required-field/required-field.module';



@NgModule({
  declarations: [
    CashRegisterComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule,
    FormsModule,
    NbAlertModule,
    NbSpinnerModule,
    NgxSpinnerModule,
    NgSelectModule,
    NgxIntlTelInputModule,
    RequiredFieldModule,
  ],
  exports: [
    CashRegisterComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CashRegisterModule { }
