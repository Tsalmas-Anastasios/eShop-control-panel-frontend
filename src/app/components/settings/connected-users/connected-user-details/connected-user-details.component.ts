import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { User, UserPrivilegesSettings } from '../../../../models';
import { TranslateService } from '@ngx-translate/core';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-connected-user-details',
  templateUrl: './connected-user-details.component.html',
  styleUrls: ['./connected-user-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ConnectedUserDetailsComponent implements OnInit, OnChanges {

  @Input() user: User;
  @Input() user_privileges: UserPrivilegesSettings;
  @Input() profile_picture: File;
  @Input() mode: 'edit' | 'preview';
  @Input() user_id: string;

  @Output() updateUserData: EventEmitter<User> = new EventEmitter<User>();
  @Output() updateUserPrivileges: EventEmitter<UserPrivilegesSettings> = new EventEmitter<UserPrivilegesSettings>();
  @Output() changePassword: EventEmitter<{ new_password: string; confirm_password: string }> = new EventEmitter<{ new_password: string; confirm_password: string }>();
  @Output() userProfileImageChange: EventEmitter<File> = new EventEmitter<File>();


  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;
  public profile_phone: any;

  public password: {
    new_password: string;
    confirm_password: string;
  } = {
      new_password: null,
      confirm_password: null,
    };


  constructor(
    public translate: TranslateService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes): void {
    this.profile_phone = this.user.phone;
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

  async onUserPasswordChange(): Promise<void> {

    if (this.password.new_password !== this.password.confirm_password) {
      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.PASSWORDS_NOT_MATCH').toPromise(),
        icon: 'error',
        timer: 3000,
      });

      this.password.new_password = null;
      this.password.confirm_password = null;

      return Promise.resolve();
    }

    this.changePassword.emit(this.password);
  }




  onUserProfileImageChange(event): void {

    if (event?.target?.files && event.target.files.length > 0) {

      const file = event.target.files[0];


      const reader = new FileReader();

      reader.onload = async (e) => {
        file['url'] = e.target.result;
        this.profile_picture = file;
        this.userProfileImageChange.emit(file);
      };

      reader.readAsDataURL(file);

    }

  }

}
