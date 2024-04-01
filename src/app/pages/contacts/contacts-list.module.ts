import { TranslateModule } from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsListComponent } from './contacts-list.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    ContactsListComponent,
  ],
  imports: [
    CommonModule,
    ContactsRoutingModule,
    TranslateModule,
    RouterModule
  ],
  exports: [
    ContactsListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ContactsListModule { }
