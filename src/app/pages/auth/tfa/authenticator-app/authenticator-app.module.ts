import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthenticatorAppComponent } from './authenticator-app.component';
import { TfaRoutingModule } from '../tfa-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';


@NgModule({
  declarations: [
    AuthenticatorAppComponent
  ],
  imports: [
    CommonModule,
    TfaRoutingModule,
    TranslateModule,
    FormsModule,
    LaddaModule,
  ],
  exports: [
    AuthenticatorAppComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AuthenticatorAppModule { }
