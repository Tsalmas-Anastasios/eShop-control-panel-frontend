import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from '../../../../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { User, UserPrivilegesSettings } from '../../../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-settings-connected-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  public user_id: string;
  public user: User;
  public mode: 'new' | 'edit' | 'preview';
  public user_full_name: string;
  public profile_picture: File;
  public user_privileges: UserPrivilegesSettings = new UserPrivilegesSettings();
  public existing_user_privileges: UserPrivilegesSettings;

  public isSubmitting = false;
  public isSending = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private utilsService: UtilsService
  ) {
  }


  ngOnInit(): void {

    this.route.params.subscribe(async (params) => {

      this.existing_user_privileges = this.utilsService.getUsersPrivileges();

      if (params.user_id === 'new')
        this.mode = 'new';
      else {
        this.user_id = params.user_id;

        this.route.queryParams.subscribe((queryParams) => {
          if (queryParams?.mode)
            if (queryParams.mode === 'edit' || queryParams.mode === 'preview')
              this.mode = queryParams.mode;
            else
              this.mode = 'preview';
          else
            this.mode = 'preview';
        });
      }


      this.checkUserPrivileges();


      if (this.mode !== 'new')
        this.seo.updatePageMetadata({ title: `${await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.TAB_TITLE').toPromise()} ${this.user_id}` });
      else
        this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.NEW_USER_TAB_TITLE').toPromise() });


      if (this.mode === 'new')
        this.createNewUser();
      else
        this.fetchUserData();

    });

  }



  checkUserPrivileges(): void {

    if (this.mode === 'new' && !this.existing_user_privileges?.users_add_new)
      this.router.navigate(['/settings']);
    else if (this.mode === 'preview' && !this.existing_user_privileges?.users_read && this.existing_user_privileges?.users_edit)
      this.mode = 'edit';
    else if (this.mode === 'preview' && !this.existing_user_privileges?.users_read)
      this.router.navigate(['/settings']);
    else if (this.mode === 'edit' && !this.existing_user_privileges?.users_edit && this.existing_user_privileges?.users_read)
      this.mode = 'preview';
    else if (this.mode === 'edit' && !this.existing_user_privileges?.users_edit)
      this.router.navigate(['/settings']);

  }



  async fetchUserData(): Promise<void> {

    this.spinner.show();


    try {

      this.user = await this.http.get<User>(`${environment.params.host}/api/settings/connected-users/user/${this.user_id}`).toPromise();
      console.log(this.user);

      this.user_full_name = `${this.user.first_name} ${this.user.last_name}`;

      this.user_privileges = new UserPrivilegesSettings().initializeUserPrivileges(this.user.privileges);


      if (!environment.production)
        console.log(this.user, this.user_privileges);

    } catch (error) {
      this.spinner.hide();

      console.log(error);

      if (error?.status && error.status === 404) {
        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.USER_NOT_FOUND').toPromise(),
          html: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.USER_NOT_FOUND_TEXT').toPromise(),
          showConfirmButton: false,
          timer: 4000,
          icon: 'error'
        }).then(() => this.router.navigate(['/settings/connected-users']));



        return Promise.resolve();
      }


      await this.utilsService.standardErrorHandling(error);
    }



    this.user_privileges = this.user_privileges.initializeUserPrivileges(this.user.privileges);


    this.spinner.hide();


  }




  createNewUser(): void {
    this.user = new User();
    this.user.privileges = this.user_privileges.initializeUserPrivilegesRecords(this.user_privileges, this.user);
  }



  toggleEditView(): void {
    this.checkUserPrivileges();
    this.mode = 'edit';
  }



  updateUserData(user: User): void {
    this.user = { ...user };
  }

  onUpdateUserPrivileges(user_privileges: UserPrivilegesSettings): void {
    this.user_privileges = user_privileges;
    this.user.privileges = this.user_privileges.initializeUserPrivilegesRecords(this.user_privileges, this.user);
  }


  // change user's password
  async onUserPasswordChange(password: { new_password: string, confirm_password: string }): Promise<void> {

    this.spinner.show();


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/connected-users/user/${this.user_id}/password/change`, { passwords: password }).toPromise();



      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.USER_PASSWORD_CHANGED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.USER_PASSWORD_CHANGED_MESSAGE').toPromise(),
        icon: 'success',
        timer: 3000
      });

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }


    this.spinner.hide();

  }



  // change user profile picture
  async userProfilePictureChange(picture: File): Promise<void> {

    const reqHeaders: HttpHeaders = new HttpHeaders();
    reqHeaders.append('Content-Type', 'multipart/form-data');

    const formData = new FormData();

    // Image to send
    formData.append('profile_picture', picture, picture.name);


    try {

      const response: any = await this.http.put<any>(`${environment.params.host}/api/settings/users/profile/picture?user_id=${this.user_id}&user_type=user`, formData, { headers: reqHeaders }).toPromise();

      // successful insertion
      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.PROFILE_PICTURE_UPDATED_SUCCESSFULLY').toPromise(),
        type: 'success'
      });

      this.user.profile_picture_url = response.file_url;


    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }

  }




  async saveNewUser(): Promise<void> {

    this.isSubmitting = true;



    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/settings/connected-users/user/u/new`, { user: this.user }).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.NEW_USER_SAVED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.NEW_USER_SAVED_MESSAGE').toPromise(),
        showConfirmButton: false,
        icon: 'success',
        timer: 3000,
      }).then(() => {
        this.router.navigate([`/settings/connected-users/${response.new_user_id}`]);
      });

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }



    this.isSubmitting = false;

  }




  // update user's data
  async saveUpdateUserData(): Promise<void> {


    this.isSubmitting = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/connected-users/user/${this.user_id}`, { user: this.user }).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.USER_UPDATED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.USER_UPDATED_MESSAGE').toPromise(),
        showConfirmButton: false,
        icon: 'success',
        timer: 3000,
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }



    this.isSubmitting = false;


  }



  // resend activation email
  async resendActivationEmail(): Promise<void> {

    this.isSending = true;



    try {

      const response = await this.http.get<any>(`${environment.params.host}/api/settings/connected-users/resend-verification-email?user_id=${this.user_id}`).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.ACTIVATION_EMAIL_SENT').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.USER_PAGE.ALERTS.ACTIVATION_EMAIL_SENT_MESSAGE').toPromise(),
        showConfirmButton: false,
        icon: 'success',
        timer: 3000,
      });

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }



    this.isSending = false;

  }

}
