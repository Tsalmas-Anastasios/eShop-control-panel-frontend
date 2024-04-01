import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { NbIconConfig, NbSearchService, NbSidebarService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../../../../services/storage.service';
import { UtilsService } from '../../../../../services/utils.service';
import { UserPrivilegesSettings } from '../../../../../models';
import { environment } from '../../../../../../environments/environment';


@Component({
  selector: 'app-navbar-dashboard',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavbarComponent implements OnInit {

  @Input() page_title: string;
  @Input() username: string;

  public profilePictureUrl: string;

  public notifications = [];

  inbox_messages = [{ title: 'Profile' }, { title: 'Log out' }];

  public account_actions = [];

  public user_privileges: UserPrivilegesSettings;
  public support_email = environment.params.emails.support;


  constructor(
    private http: HttpClient,
    private nebularSearchService: NbSearchService,
    private nebularSideBarService: NbSidebarService,
    public translate: TranslateService,
    private storage: StorageService,
    private utilsService: UtilsService
  ) {
  }

  async ngOnInit(): Promise<void> {

    const user = this.storage.getItem('user');
    this.profilePictureUrl = user?.profile_picture_url || null;
    this.username = `${user.first_name} ${user.last_name}`;

    this.user_privileges = this.utilsService.getUsersPrivileges();




    if (!this.page_title)
      this.page_title = await this.translate.get('GENERIC.LAYOUT.NAVBAR.DASHBOARD').toPromise();

    if (!this.username)
      this.username = await this.translate.get('GENERIC.LAYOUT.NAVBAR.ANONYMOUS_USER').toPromise();


    this.account_actions = [
      {
        title: await this.translate.get('GENERIC.LAYOUT.NAVBAR.PROFILE').toPromise(),
        icon: 'person',
        link: '/settings',
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.NAVBAR.SETTINGS').toPromise(),
        icon: 'settings-2-outline',
        link: '/settings/company'
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.NAVBAR.LOGOUT').toPromise(),
        icon: 'log-out',
        link: '/logout',
      }
    ];
  }



  activateSearchComponent(search_component_type: string, tag: string): void {
    this.nebularSearchService.activateSearch(search_component_type, tag);
  }


  changeSideBarStatus(tag: string): void {
    this.hideSidebarLabelElements(tag);
    this.nebularSideBarService.toggle(true, tag);
  }



  hideSidebarLabelElements(tag: string): void {

    const labels: HTMLCollectionOf<Element> = document.getElementsByClassName('category-label');
    for (let i = 0; i < labels.length; i++) {
      if ((labels[i] as HTMLElement).style.display === 'block' || (labels[i] as HTMLElement).style.display === 'inline-block')
        (labels[i] as HTMLElement).style.display = 'none';
      else
        (labels[i] as HTMLElement).style.display = 'block';
    }


  }








}
