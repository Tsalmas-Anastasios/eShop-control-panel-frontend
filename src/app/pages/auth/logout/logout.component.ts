import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../services/storage.service';
import { SeoService } from '../../../services/seo.service';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private http: HttpClient,
    private storageService: StorageService,
    private router: Router,
    private seo: SeoService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.LOGOUT.TITLE').toPromise() });

    try {

      this.spinner.show();

      const response = await this.http.post<any>(
        `${environment.params.host}/api/auth/logout`,
        null
      ).toPromise();

      this.storageService.removeItem('user');
      this.storageService.removeItem('is_account');
      this.storageService.removeItem('using_bizyhive_cloud');
      this.storageService.removeItem('orders_condition');

      this.router.navigate(['/login']);

      window.location.reload();

      this.spinner.hide();

    } catch (error) {
      this.storageService.removeItem('user');
      this.storageService.removeItem('is_account');
      this.storageService.removeItem('using_bizyhive_cloud');
      this.storageService.removeItem('orders_condition');

      this.router.navigate(['/login']);
      this.spinner.hide();
    }

  }

}
