import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from '../../../../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChangePasswordNewPassword } from '../../../../models';

@Component({
  selector: 'app-connected-users',
  templateUrl: './connected-users.component.html',
  styleUrls: ['./connected-users.component.scss']
})
export class ConnectedUsersComponent implements OnInit {

  private activation_token: string;
  public isSubmitting = false;
  public passwords_not_match = false;
  private user_id: string;

  public passwords: {
    new_password: string;
    confirm_password: string;
  } = {
      new_password: null,
      confirm_password: null,
    };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {




    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.TAB_TITLE').toPromise() });




    // get queryParams
    this.route.queryParams.subscribe(async (params) => {

      this.spinner.show();


      this.activation_token = params?.key || null;

      if (!this.activation_token)
        this.router.navigate(['/login']);



      if (!environment.production)
        console.log(this.activation_token);



      // validate token & activate user
      try {

        const response = await this.http.get<any>(`${environment.params.host}/api/auth/email-activation?key=${this.activation_token}`).toPromise();


        if (response.type === 'already_activated') {
          this.utilsService.swal.fire({
            title: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.USER_ALREADY_ACTIVATED').toPromise(),
            html: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.USER_ALREADY_ACTIVATED_MESSAGE').toPromise(),
            icon: 'error',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.router.navigate(['/login']);
          });

          return Promise.resolve();
        }


        this.user_id = response.user_id;


        this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.USER_ACTIVATED').toPromise(),
          html: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.USER_ACTIVATED_MESSAGE').toPromise(),
          icon: 'success'
        });

      } catch (error) {

        this.spinner.hide();

        if (error?.error?.code === 401) {
          this.utilsService.swal.fire({
            title: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.INVALID_ACTIVATION_USER').toPromise(),
            html: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.INVALID_ACTIVATION_TOKEN_MESSAGE').toPromise(),
            icon: 'error',
            showConfirmButton: false,
            timer: 3000
          }).then(() => {
            this.router.navigate(['/login']);
          });

          return Promise.resolve();
        } else if (error?.error?.code === 419) {
          this.utilsService.swal.fire({
            title: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.ACTIVATION_KEY_EXPIRED').toPromise(),
            html: await this.translate.get('VIEWS.REGISTER.CONNECTED_USER.ALERTS.ACTIVATION_KEY_EXPIRED_MESSAGE', { new_activation_link: `${environment.params.front_end_host}/register/cu?key=${error?.error?.activation_key || null}` }).toPromise(),
            icon: 'error',
            showConfirmButton: false,
          });

          return Promise.resolve();
        }


        this.utilsService.standardErrorHandling(error);
      }


      this.spinner.hide();

    });


  }





  async submitForm(): Promise<void> {

    this.isSubmitting = true;


    if (this.passwords.new_password !== this.passwords.confirm_password) {
      this.passwords_not_match = true;

      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.PASSWORD_CHANGE.PASSWORDS_DO_NOT_MATCH').toPromise(),
        timer: 3000,
        icon: 'error',
      }).then(() => {
        this.passwords.confirm_password = null;
        this.passwords.new_password = null;
      });

      this.isSubmitting = false;

      return;
    }



    try {

      const res_data: ChangePasswordNewPassword = {
        id: this.user_id,
        password: this.passwords.new_password,
        confirm_password: this.passwords.confirm_password,
        account_type: 'user'
      };


      const response = await this.http.put<any>(`${environment.params.host}/api/auth/change-password`, res_data).toPromise();



      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.PASSWORD_CHANGE.PASSWORD_UPDATED_SUCCESSFULLY').toPromise(),
        html: await this.translate.get('VIEWS.PASSWORD_CHANGE.PASSWORD_UPDATED_SUCCESSFULLY_EXPLAIN').toPromise(),
        icon: 'success',
        timer: 3000
      }).then(() => this.router.navigate(['/login']));


    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }


    this.isSubmitting = false;

  }

}
