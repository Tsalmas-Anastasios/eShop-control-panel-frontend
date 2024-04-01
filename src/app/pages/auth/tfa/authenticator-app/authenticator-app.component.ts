import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../../services/seo.service';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../services/storage.service';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authenticator-app',
  templateUrl: './authenticator-app.component.html',
  styleUrls: ['./authenticator-app.component.scss']
})
export class AuthenticatorAppComponent implements OnInit {

  public code: string;

  private session_data: any;
  private tfa: any;
  private returnUrl: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    public translate: TranslateService,
    private seo: SeoService,
    private storageService: StorageService,
    private utilsService: UtilsService
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.TWO_FACTOR_AUTHENTICATION.AUTHENTICATOR.TAB_TITLE').toPromise() });


    this.session_data = this.storageService.getItem('session_data');
    this.storageService.removeItem('session_data');
    this.tfa = this.storageService.getItem('tfa');
    this.storageService.removeItem('tfa');
    this.returnUrl = this.storageService.getItem('returnUrl');
    this.storageService.removeItem('returnUrl');

  }




  async submit6DigitCode(): Promise<void> {

    if (this.code.length !== 6)
      return;


    document.getElementById('loading-text').innerHTML = await this.translate.get('VIEWS.TWO_FACTOR_AUTHENTICATION.AUTHENTICATOR.LOADING').toPromise();
    document.getElementById('error-message').innerHTML = '';


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/authentication/account/security/2fa/app/authentication-code/verify`, { code: this.code, session_data: this.session_data }).toPromise();


      this.storageService.setItem('user', response.user);



      if (this.returnUrl !== '/')
        this.router.navigate([this.returnUrl]);
      else
        this.router.navigate(['/']);


      console.log(`Bizyhive e-Commerce Control Panel - Copyright 20[2-9][0-9] - Adorithm Ltd`);

      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.LOGIN.ALERTS.SUCCESSFULLY_CONNECTED_TITLE').toPromise(),
        html: await this.translate.get('VIEWS.LOGIN.ALERTS.SUCCESSFULLY_CONNECTED_MESSAGE', { first_name: response.user.first_name, last_name: response.user.last_name }).toPromise(),
        icon: 'success',
      });

    } catch (error) {

      if (error?.error?.code === 403) {
        document.getElementById('loading-text').innerHTML = '';
        document.getElementById('error-message').innerHTML = await this.translate.get('VIEWS.TWO_FACTOR_AUTHENTICATION.AUTHENTICATOR.INVALID_6DIGIT_CODE').toPromise();
        return;
      }



      document.getElementById('loading-text').innerHTML = '';
      document.getElementById('error-message').innerHTML = await this.translate.get('GENERIC.ALERTS.SOMETHING_WENT_WRONG').toPromise();

      this.utilsService.standardErrorHandling(error);
    }


  }

}
