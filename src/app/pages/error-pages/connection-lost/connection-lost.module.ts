import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectionLostComponent } from './connection-lost.component';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [
    ConnectionLostComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    ConnectionLostComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectionLostModule { }
