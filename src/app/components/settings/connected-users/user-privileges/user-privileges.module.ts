import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserPrivilegesComponent } from './user-privileges.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserPrivilegesComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
  ],
  exports: [
    UserPrivilegesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserPrivilegesModule { }
