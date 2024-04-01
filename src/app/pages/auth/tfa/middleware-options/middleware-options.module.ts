import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiddlewareOptionsComponent } from './middleware-options.component';
import { TfaRoutingModule } from '../tfa-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    MiddlewareOptionsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    TfaRoutingModule,
    RouterModule,
  ],
  exports: [
    MiddlewareOptionsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MiddlewareOptionsModule { }
