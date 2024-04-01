import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDetailsComponent } from './user-details.component';
import { SettingsConnectedUsersRoutingModule } from '../settings-connected-users-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { FormsModule } from '@angular/forms';
import { ConnectedUserCreationModule } from '../../../../components/settings/connected-users/connected-user-creation/connected-user-creation.module';
import { LaddaModule } from 'angular2-ladda';
import { ConnectedUserDetailsModule } from '../../../../components/settings/connected-users/connected-user-details/connected-user-details.module';



@NgModule({
  declarations: [
    UserDetailsComponent
  ],
  imports: [
    CommonModule,
    SettingsConnectedUsersRoutingModule,
    TranslateModule,
    NgxSpinnerModule,
    FormsModule,
    ConnectedUserCreationModule,
    LaddaModule,
    ConnectedUserDetailsModule,
  ],
  exports: [
    UserDetailsComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserDetailsModule { }
