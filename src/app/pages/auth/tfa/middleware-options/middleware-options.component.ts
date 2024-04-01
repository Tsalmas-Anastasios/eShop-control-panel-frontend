import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { StorageService } from '../../../../services/storage.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { UtilsService } from '../../../../services/utils.service';

@Component({
  selector: 'app-middleware-options',
  templateUrl: './middleware-options.component.html',
  styleUrls: ['./middleware-options.component.scss']
})
export class MiddlewareOptionsComponent implements OnInit {

  public session_data: any;
  public tfa: any;
  public returnUrl: any;

  constructor(
    private router: Router,
    private http: HttpClient,
    private seo: SeoService,
    public translate: TranslateService,
    private storageService: StorageService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.TWO_FACTOR_AUTHENTICATION.MIDDLEWARE.TAB_TITLE').toPromise() });


    this.session_data = this.storageService.getItem('session_data');
    this.storageService.removeItem('session_data');
    this.tfa = this.storageService.getItem('tfa');
    this.storageService.removeItem('tfa');
    this.returnUrl = this.storageService.getItem('returnUrl');
    this.storageService.removeItem('returnUrl');

  }


  createStorageObjects(): void {
    this.storageService.setItem('session_data', this.session_data);
    this.storageService.setItem('tfa', this.tfa);
    this.storageService.setItem('returnUrl', this.returnUrl);
  }




  async sendEmailCode(): Promise<void> {

    try {

      this.createStorageObjects();
      const response = await this.http.put<any>(`${environment.params.host}/api/authentication/account/security/2fa/email/authentication-code/send-email`, { user: this.session_data.user }).toPromise();


    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }

  }


}
