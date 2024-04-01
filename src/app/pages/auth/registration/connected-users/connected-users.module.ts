import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConnectedUsersComponent } from './connected-users.component';
import { ConnectedUsersRegistrationRoutingModule } from './connected-users-routing.module';
import { FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { TranslateModule } from '@ngx-translate/core';
import { RequiredFieldModule } from '../../../../modules/required-field/required-field.module';
import { NgxSpinnerModule } from 'ngx-spinner';


@NgModule({
  declarations: [
    ConnectedUsersComponent
  ],
  imports: [
    CommonModule,
    ConnectedUsersRegistrationRoutingModule,
    FormsModule,
    LaddaModule,
    TranslateModule,
    RequiredFieldModule,
    NgxSpinnerModule,
  ],
  exports: [
    ConnectedUsersComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ConnectedUsersModule { }
