import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordChangeCredentialsComponent } from './password-change-credentials.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordChangeRoutingModule } from '../password-change-routing.module';
import { LaddaModule } from 'angular2-ladda';


@NgModule({
  declarations: [
    PasswordChangeCredentialsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    PasswordChangeRoutingModule,
    LaddaModule,
  ],
  exports: [
    PasswordChangeCredentialsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PasswordChangeCredentialsModule { }
