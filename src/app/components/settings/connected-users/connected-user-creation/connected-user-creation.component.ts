import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { User, UserPrivilegesSettings } from '../../../../models';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-connected-user-creation',
  templateUrl: './connected-user-creation.component.html',
  styleUrls: ['./connected-user-creation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ConnectedUserCreationComponent implements OnInit {

  @Input() user: User;
  @Input() user_privileges: UserPrivilegesSettings;
  // @Input() profile_picture: File;

  @Output() updateUserData: EventEmitter<User> = new EventEmitter<User>();
  @Output() updateUserPrivileges: EventEmitter<UserPrivilegesSettings> = new EventEmitter<UserPrivilegesSettings>();
  // @Output() userProfileImageChange: EventEmitter<File> = new EventEmitter<File>();

  public profile_picture_link: string | ArrayBuffer;


  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;
  public profile_phone: any;



  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }




  formatProfileTelephone(): void {
    this.user.phone = this.profile_phone?.internationalNumber || null;
    this.onUpdateUserData();
  }



  onUpdateUserData(): void {
    this.updateUserData.emit(this.user);
  }

  onUpdateUserPrivileges(user_privileges: UserPrivilegesSettings): void {
    this.user_privileges = user_privileges;
    this.updateUserPrivileges.emit(this.user_privileges);
  }



  // onUserProfileImageChange(event): void {

  //   console.log(event);

  //   if (event?.target?.files && event.target.files.length > 0) {

  //     const file = event.target.files[0];

  //     this.profile_picture_link = file.name;

  //     if (!environment.production)
  //       console.log(file);


  //     const reader = new FileReader();

  //     reader.onload = async (e) => {
  //       file['url'] = e.target.result;
  //       this.profile_picture = file;
  //       this.userProfileImageChange.emit(file);
  //     };

  //     reader.readAsDataURL(file);

  //   }

  // }


}
