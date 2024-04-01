import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from '../../../../services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '../../../../../environments/environment';
import { ChangePasswordNewPassword } from '../../../../models';

@Component({
  selector: 'app-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss']
})
export class ChangePasswordFormComponent implements OnInit {

  public passwords: {
    new_password: string;
    confirm_password: string;
  } = {
      new_password: null,
      confirm_password: null,
    };


  public passwords_not_match = false;
  private change_password_token: string;
  public permission_given: boolean;
  public redirected_seconds = 10;
  private user_id: string;
  public isSubmitting = false;
  private account_type: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private seo: SeoService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PASSWORD_CHANGE.CREATE_NEW_PASSWORD').toPromise() });

    this.change_password_token = this.route.snapshot.params['token'];


    try {

      const response = await this.http.get<any>(`${environment.params.host}/api/auth/check-password-change-token?key=${this.change_password_token}`).toPromise();

      this.permission_given = response?.valid || false;
      this.user_id = response?.id || null;
      this.account_type = response?.account_type || null;


    } catch (error) {
      this.permission_given = false;

      await this.utilsService.standardErrorHandling(error);
    }



    let myInterval;
    if (!this.permission_given)
      myInterval = setInterval(() => {
        console.log(this.redirected_seconds);
        this.redirected_seconds--;

        if (this.redirected_seconds === 0) {
          clearInterval(myInterval);
          this.router.navigate(['/login']);
        }
      }, 1000);

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
        account_type: this.account_type
      };


      const response = await this.http.put<any>(`${environment.params.host}/api/auth/change-password`, res_data).toPromise();



      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.PASSWORD_CHANGE.PASSWORD_UPDATED_SUCCESSFULLY').toPromise(),
        html: await this.translate.get('VIEWS.PASSWORD_CHANGE.PASSWORD_UPDATED_SUCCESSFULLY_EXPLAIN').toPromise(),
        icon: 'success',
        timer: 3000
      }).then(() => this.router.navigate(['/login']));


    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.isSubmitting = false;

  }

}
