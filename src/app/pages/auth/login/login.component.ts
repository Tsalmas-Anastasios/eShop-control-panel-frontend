import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { environment } from '../../../../environments/environment';
import { SweetAlertOptions } from 'sweetalert2';
import { UtilsService } from '../../../services/utils.service';
import { HttpClient } from '@angular/common/http';
import { User, LoginAuthData } from '../../../models';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {

  private returnUrl: string = null;
  private source: 'ecommerce_control_panel' = null;
  public isConnecting = false;
  private user: User = null;
  public login_data: LoginAuthData = {
    username: null,
    password: null,
    remember_me: false,
  };
  public user_not_found = false;

  constructor(
    public translate: TranslateService,
    private seo: SeoService,
    private router: Router,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private http: HttpClient,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.LOGIN.TAB_TITLE').toPromise() });

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';

    const user: User = this.storageService.getItem('user');

    if (user && user.id)
      this.router.navigate(['/']);

    if (this.route.snapshot.queryParams.source)
      this.source = this.route.snapshot.queryParams.source;

  }


  ngAfterViewInit(): void {

  }




  async submitLoginForm(): Promise<void> {

    this.isConnecting = true;
    if (!this.checkRequiredFields()) {
      this.isConnecting = false;
      return;
    }

    try {

      const user = await this.http.post<any>(
        `${environment.params.host}/api/auth/login`,
        this.login_data
      ).toPromise();



      if (!user?.user?.authentication_2fa__app || !user?.user?.authentication_2fa__email) {
        // initialize user in the user's storage
        this.user = user;
        this.initializeUserData(user);
      } else {
        const session_data = user;
        this.tfaInitialization(session_data);
      }

    } catch (error) {

      this.isConnecting = false;

      if (error?.error?.type === 'user_not_found_username_or_email_wrong' || error?.error?.message === 'Wrong password') {
        this.user_not_found = true;

        return;
      } else if (error?.error?.message === 'Your email is not activated') {
        await this.utilsService.swal.fire({
          title: await this.translate.get('VIEWS.LOGIN.ALERTS.EMAIL_NOT_ACTIVATED').toPromise(),
          html: await this.translate.get('VIEWS.LOGIN.ALERTS.EMAIL_NOT_ACTIVATED_PROMPT').toPromise(),
          icon: 'error',
          allowOutsideClick: false,
        });

        return;
      }


      await this.utilsService.standardErrorHandling(error);
    }

  }




  async initializeUserData(user: User): Promise<void> {

    this.storageService.setItem('user', user);
    this.storageService.setItem('is_account', user.is_account);
    this.storageService.setItem('using_bizyhive_cloud', user?.using_bizyhive_cloud || null);

    this.isConnecting = false;

    if (this.returnUrl !== '/')
      this.router.navigate([this.returnUrl]);
    else
      this.router.navigate(['/']);



    console.log(`Bizyhive e-Commerce Control Panel - Copyright 20[2-9][0-9] - Adorithm Ltd`);

    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.LOGIN.ALERTS.SUCCESSFULLY_CONNECTED_TITLE').toPromise(),
      html: await this.translate.get('VIEWS.LOGIN.ALERTS.SUCCESSFULLY_CONNECTED_MESSAGE', { first_name: user.first_name, last_name: user.last_name }).toPromise(),
      icon: 'success',
    });

  }



  async tfaInitialization(user: any): Promise<void> {

    const tfa: {
      authentication_2fa__email?: boolean;
      authentication_2fa__app?: boolean;
      authentication_2fa__app_secret?: string;
    } = {
      authentication_2fa__email: user?.user?.authentication_2fa__email || false,
      authentication_2fa__app: user?.user?.authentication_2fa__app || false,
      authentication_2fa__app_secret: user?.user?.authentication_2fa__app_secret || null,
    };

    const session_data: any = user;


    this.storageService.setItem('session_data', session_data);
    this.storageService.setItem('tfa', tfa);
    this.storageService.setItem('returnUrl', this.returnUrl);


    if (tfa.authentication_2fa__app && tfa.authentication_2fa__email)
      this.router.navigate(['/login/tfa']);
    else if (tfa.authentication_2fa__app)
      this.router.navigate(['/login/tfa/authenticator-app']);
    else if (tfa.authentication_2fa__email) {

      try {

        const response = await this.http.put<any>(`${environment.params.host}/api/authentication/account/security/2fa/email/authentication-code/send-email`, { user: session_data.user }).toPromise();
        this.router.navigate(['/login/tfa/email-authentication']);

      } catch (error) {
        this.utilsService.standardErrorHandling(error);
      }

    }

  }



  checkRequiredFields(): boolean {

    let flag = true;

    for (const key in this.login_data)
      if (this.login_data[key] === null)
        flag = false;

    return flag;

  }


}
