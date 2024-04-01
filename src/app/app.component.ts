import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import isOnline from 'is-online';
import { NavigationExtras, Router } from '@angular/router';
import { environment } from '../environments/environment';
import { UtilsService } from './services/utils.service';
import { StorageService } from './services/storage.service';
import { AuthGuard } from './services/guards/auth.service';
import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bizihive-ecommerce-control-panel-frontend';
  public networkStatus = false;
  private internet_connection_interval_updater: any = null;
  private auth_guard_interval_updater: any = null;

  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private router: Router,
    private utilsService: UtilsService,
    private storageService: StorageService,
    private authGuard: AuthGuard,
  ) {

    translate.setDefaultLang('en');
    translate.use('en');


    let flag = true;
    this.internet_connection_interval_updater = setInterval(async () => {
      this.networkStatus = await isOnline();

      const extras: NavigationExtras = {};
      if (!this.networkStatus) {
        if (flag) {
          flag = false;
          this.utilsService.showToast({
            title: await this.translate.get('GENERIC.LABELS.WIFI_CONNECTION_LOST').toPromise(),
            message: await this.translate.get('GENERIC.LABELS.UNFORTUNATELY_WIFI_CONNECTION_LOST').toPromise(),
            type: 'warning',
          });
        }
        // if (!window.location.pathname.includes('/connection-lost')) {
        //   extras.queryParams = {
        //     returnUrl: window.location.pathname
        //   };
        //   this.router.navigate(['/connection-lost'], extras);
        // }

        return;
      } else {
        if (!flag)
          this.utilsService.showToast({
            title: await this.translate.get('GENERIC.LABELS.WIFI_RESTORED_TITLE').toPromise(),
            message: await this.translate.get('GENERIC.LABELS.WIFI_RESTORED_TEXT').toPromise(),
            type: 'success',
          });
        flag = true;
        return;
      }
    }, 2000);






    // auth guard
    // this.auth_guard_interval_updater = setInterval(async () => {
    //   if (!window.location.pathname.includes('/login'))
    //     this.authGuard.canActivate();
    // }, 10000);

  }



  async ngOnInit(): Promise<void> {

    // user object
    const demo_user = this.storageService.getItem('user');

    if (demo_user) {
      const user = await this.http.get<any>(`${environment.params.host}/api/settings/users/data/user-data`).toPromise();
      this.utilsService.refreshUserDataObject(user);

      if ((user && user.user_id) && !environment.production)
        console.log(user);
    }

  }

}
