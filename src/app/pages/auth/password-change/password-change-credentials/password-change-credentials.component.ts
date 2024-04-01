import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-password-change-credentials',
  templateUrl: './password-change-credentials.component.html',
  styleUrls: ['./password-change-credentials.component.scss']
})
export class PasswordChangeCredentialsComponent implements OnInit {

  public accountEmail_value: string;
  public email_sent: 'none' | 'email_sent' = 'none';
  public isSubmitting = false;

  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private seo: SeoService,
    private utilsService: UtilsService
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PASSWORD_CHANGE.TAB_TITLE').toPromise() });

  }




  async submitForm(): Promise<void> {

    this.isSubmitting = true;


    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/auth/request-new-password`, { username: this.accountEmail_value }).toPromise();
      this.email_sent = 'email_sent';

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

    this.isSubmitting = false;

  }

}
