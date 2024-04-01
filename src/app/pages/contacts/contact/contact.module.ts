import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactComponent } from './contact.component';
import { ContactsRoutingModule } from '../contacts-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ContactFormModule } from '../../../components/contact-form/contact-form.module';
import { LaddaModule } from 'angular2-ladda';

@NgModule({
  declarations: [
    ContactComponent
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    TranslateModule,
    FormsModule,
    ContactFormModule,
    LaddaModule
  ],
  exports: [
    ContactComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactModule { }
