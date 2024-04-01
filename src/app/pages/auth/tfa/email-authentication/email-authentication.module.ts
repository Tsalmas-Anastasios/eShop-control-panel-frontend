import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailAuthenticationComponent } from './email-authentication.component';
import { TfaRoutingModule } from '../tfa-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    EmailAuthenticationComponent
  ],
  imports: [
    CommonModule,
    TfaRoutingModule,
    TranslateModule,
    FormsModule,
  ],
  exports: [
    EmailAuthenticationComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EmailAuthenticationModule { }
