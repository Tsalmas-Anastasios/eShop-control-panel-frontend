import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChangePasswordFormComponent } from './change-password-form.component';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordChangeRoutingModule } from '../password-change-routing.module';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';



@NgModule({
  declarations: [
    ChangePasswordFormComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LaddaModule,
    TranslateModule,
    PasswordChangeRoutingModule,
    RequiredFieldModule,
  ],
  exports: [
    ChangePasswordFormComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChangePasswordFormModule { }
