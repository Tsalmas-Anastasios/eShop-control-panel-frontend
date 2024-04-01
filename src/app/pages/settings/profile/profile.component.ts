import { UtilsService } from './../../../services/utils.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Dimensions, ImageCroppedEvent, ImageTransform, base64ToFile } from 'ngx-image-cropper';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { NgForm } from '@angular/forms';
import { SessionDataObject } from '../../../models';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-settings-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public user: SessionDataObject;
  public user_editable_instance: SessionDataObject;
  public isUpdatingUserData = false;

  public profileImageCropper: {
    image: File; imageAfterCrop: any; croppedImage: any; imageChangedEvent: any; canvasRotation: number; rotation: number; scale: number; showCropper: boolean;
    containWithinAspectRatio: boolean; transform: ImageTransform;
  } = {
      image: null,
      imageAfterCrop: null,
      croppedImage: '',
      imageChangedEvent: '',
      canvasRotation: 0,
      rotation: 0,
      scale: 1,
      showCropper: false,
      containWithinAspectRatio: false,
      transform: {}
    };


  public change_password_form: {
    old_password: string;
    new_password: string;
  } = {
      old_password: null,
      new_password: null,
    };
  public change_password_form_global_error: 'old_password_wrong' | 'same_passwords';
  public isPasswordChanging = false;

  public user_info_display_mode: 'show' | 'edit' = 'show';


  // for telephone input
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;
  public profile_phone: any;



  public two_step_verification: 'none' | 'email_processing' | 'app_processing' | 'done' = 'none';
  public authentication_code: string;
  public two_step_verification_isSubmitting = false;

  public two_step_verification_app: 'none' | 'processing' | 'done' = 'none';
  public two_step_verification_6digit: string;
  public two_step_verification_app_isSubmitting = false;
  public two_step_verification_qr_data: {
    otpauth_url: string;
    code: string;
  };

  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private seo: SeoService,
    private storageService: StorageService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.user = this.storageService.getItem('user');
    if (!environment.production)
      console.log(this.user);



    // tab title
    this.seo.updatePageMetadata({ title: `${this.user.first_name} ${this.user.last_name}` });

  }





  // change profile picture
  async onUserProfileImageChange(event): Promise<void> {

    if (event?.target?.files && event.target.files.length > 0) {

      const file = event.target.files[0];

      if (!environment.production)
        console.log(file);

      const reader = new FileReader();

      reader.onload = async (e) => {

        file.url = e.target.result;
        this.user.profile_picture_url = file.url;

      };


      reader.readAsDataURL(file);


      const image_url = await this.updateUserProfilePicture(file);
      this.user.profile_picture_url = image_url;

      this.storageService.removeItem('user');
      this.storageService.setItem('user', this.user);

      this.storageService.sessionData.next(this.user);
    }

  }



  async updateUserProfilePicture(file: File): Promise<string> {

    const reqHeaders: HttpHeaders = new HttpHeaders();
    reqHeaders.append('Content-Type', 'multipart/form-data');

    const formData = new FormData();

    // Image to send
    formData.append('profile_picture', file, file.name);


    try {

      const response: any = await this.http.put<any>(`${environment.params.host}/api/settings/users/profile/picture`, formData, { headers: reqHeaders }).toPromise();

      // successful insertion
      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.PROFILE_PICTURE_UPDATED_SUCCESSFULLY').toPromise(),
        type: 'success'
      });

      return response.file_url;


    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }

  }




  // change user's password
  async changeAccountPassword(changePasswordForm: NgForm): Promise<void> {

    this.isPasswordChanging = true;


    // check if the passwords are same
    if (this.change_password_form.old_password === this.change_password_form.new_password) {
      this.change_password_form_global_error = 'same_passwords';
      this.isPasswordChanging = false;
      return;
    }

    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/auth/change-password-directly`, this.change_password_form).toPromise();


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.PASSWORD_CHANGED').toPromise(),
        type: 'success',
      });

      this.change_password_form.new_password = null;
      this.change_password_form.old_password = null;

      changePasswordForm.reset();

      this.change_password_form_global_error = null;
      this.isPasswordChanging = false;

    } catch (error) {
      this.isPasswordChanging = false;

      if (!environment.production)
        console.log(error);


      // error.error?.code --- ?.type --- ?.message
      // initialize errors
      if (error?.error?.code)
        if (error.error.code === 403)
          this.change_password_form_global_error = 'old_password_wrong';
        else
          this.utilsService.showToast({
            message: await this.translate.get('GENERIC.ALERTS.SOMETHING_WENT_WRONG').toPromise(),
            type: 'error'
          });

    }

  }




  // toggle user info mode (show or edit)
  toggleUserInformationDisplayMode(mode: 'show' | 'edit'): void {
    this.user_info_display_mode = mode;

    if (mode === 'edit') {
      this.user_editable_instance = { ...this.user };
      this.profile_phone = this.user.phone;
    }

  }



  // format profile telephone
  formatProfileTelephone(): void {
    this.user_editable_instance.phone = this.profile_phone?.internationalNumber || null;
  }




  async updateUserData(): Promise<void> {

    this.isUpdatingUserData = true;

    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/users/profile/update-data`, this.user_editable_instance).toPromise();



      this.storageService.removeItem('user');
      this.storageService.setItem('user', this.user_editable_instance);

      this.storageService.sessionData.next(this.user_editable_instance);

      this.isUpdatingUserData = false;

      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.USER_DATA_UPDATED_SUCCESSFULLY').toPromise(),
        icon: 'success'
      }).then((click_action) => {
        window.location.reload();
      });
    } catch (error) {
      this.isUpdatingUserData = false;


      if (error?.error?.code && error.error.code === 400) {
        if (error.error.type === 'username_exists')
          this.utilsService.showToast({
            message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.USERNAME_ALREADY_EXISTS').toPromise(),
            type: 'error'
          });
        else if (error.error.type === 'email_exists')
          this.utilsService.showToast({
            message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.EMAIL_ALREADY_EXISTS').toPromise(),
            type: 'error'
          });
        else if (error.error.type === 'phone_exists')
          this.utilsService.showToast({
            message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.PHONE_ALREADY_EXISTS').toPromise(),
            type: 'error'
          });
      } else
        await this.utilsService.standardErrorHandling(error);
    }

  }



  async get2FactoryAuthenticationEmailCode(): Promise<void> {

    this.two_step_verification_isSubmitting = true;

    try {


      const response = await this.http.put(`${environment.params.host}/api/authentication/account/security/2fa/email/authentication-code/send-email`, null).toPromise();

      this.two_step_verification = 'email_processing';


    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }


    this.two_step_verification_isSubmitting = false;

  }



  async submitAuthenticationCodeEmail(): Promise<void> {

    this.two_step_verification_isSubmitting = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/account/security/2fa/email/activate`, { code: this.authentication_code }).toPromise();

      this.user.authentication_2fa__email = true;

      this.storageService.removeItem('user');
      this.storageService.setItem('user', this.user);

      document.getElementById('authenticationCodeEmailAriaHelp').innerHTML = '';

      this.two_step_verification = 'none';


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.EMAIL_2FA_ACTIVATED').toPromise(),
        type: 'success',
      });

    } catch (error) {
      if (error?.error?.code === 404) {
        document.getElementById('authenticationCodeEmailAriaHelp').innerHTML = await this.translate.get('VIEWS.SETTINGS.PROFILE.ACCOUNT_SECURITY_SECTION.WRONG_ENTERED_CODE').toPromise();
        this.two_step_verification_isSubmitting = false;
        return;
      }

      await this.utilsService.standardErrorHandling(error);
    }

    this.authentication_code = null;
    this.two_step_verification_isSubmitting = false;

  }



  async disableAuthenticationViaEmail(): Promise<void> {

    this.two_step_verification_isSubmitting = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/account/security/2fa/email/de-activate`, { code: this.authentication_code }).toPromise();

      this.user.authentication_2fa__email = false;

      this.storageService.removeItem('user');
      this.storageService.setItem('user', this.user);

      document.getElementById('authenticationCodeEmailAriaHelp').innerHTML = '';

      this.two_step_verification = 'none';



      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ALERTS.EMAIL_2FA_DEACTIVATED').toPromise(),
        type: 'warning',
      });

    } catch (error) {
      if (error?.error?.code === 404) {
        document.getElementById('authenticationCodeEmailAriaHelp').innerHTML = await this.translate.get('VIEWS.SETTINGS.PROFILE.ACCOUNT_SECURITY_SECTION.WRONG_ENTERED_CODE').toPromise();
        return;
      }

      await this.utilsService.standardErrorHandling(error);
    }


    this.authentication_code = null;
    this.two_step_verification_isSubmitting = false;

  }




  async enableAuthenticationViaApp(): Promise<void> {

    this.two_step_verification_app_isSubmitting = true;

    try {

      const response = await this.http.get<{ otpauth_url: string, code: string }>(`${environment.params.host}/api/authentication/account/security/2fa/app/authentication-code/key`).toPromise();
      this.two_step_verification_qr_data = { otpauth_url: response.otpauth_url, code: response.code };

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }



    this.two_step_verification_app = 'processing';
    this.two_step_verification_app_isSubmitting = false;

  }




  async validate6DigitCodeActivateAuthenticationAppService(): Promise<void> {

    if (this.two_step_verification_6digit.length !== 6)
      return;


    this.two_step_verification_app_isSubmitting = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/accouns/security/2fa/app/enable`, { secret: this.two_step_verification_qr_data.code, code: this.two_step_verification_6digit }).toPromise();

      this.user.authentication_2fa__app = true;
      this.user.authentication_2fa__app_secret = this.two_step_verification_qr_data.code;

      this.storageService.removeItem('user');
      this.storageService.setItem('user', this.user);


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ACCOUNT_SECURITY_SECTION.APP_2FA_ENABLED').toPromise(),
        type: 'success',
      });

    } catch (error) {


      if (error?.error?.code === 403) {
        document.getElementById('authenticationAppError').innerHTML = await this.translate.get('VIEWS.SETTINGS.PROFILE.ACCOUNT_SECURITY_SECTION.INVALID_6_DIGIT_CODE').toPromise();
        return Promise.reject();
      }


      await this.utilsService.standardErrorHandling(error);
    }


    this.two_step_verification_6digit = null;
    this.two_step_verification_app = 'none';
    this.two_step_verification_app_isSubmitting = false;

  }




  async disableTwoFactorAuthenticationViaApp(): Promise<void> {

    if (this.two_step_verification_6digit.length !== 6)
      return;


    this.two_step_verification_app_isSubmitting = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/settings/account/security/2fa/app/disable`, { code: this.two_step_verification_6digit }).toPromise();

      this.user.authentication_2fa__app = false;
      this.user.authentication_2fa__app_secret = null;

      this.storageService.removeItem('user');
      this.storageService.setItem('user', this.user);


      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.PROFILE.ACCOUNT_SECURITY_SECTION.APP_2FA_DISABLED').toPromise(),
        type: 'warning',
      });

    } catch (error) {

      if (error?.error?.code === 403) {
        document.getElementById('authenticationAppError').innerHTML = await this.translate.get('VIEWS.SETTINGS.PROFILE.ACCOUNT_SECURITY_SECTION.INVALID_6_DIGIT_CODE').toPromise();
        return Promise.reject();
      }


      await this.utilsService.standardErrorHandling(error);

      return;
    }


    this.two_step_verification_6digit = null;
    this.two_step_verification_app = 'none';
    this.two_step_verification_app_isSubmitting = false;

  }

}
