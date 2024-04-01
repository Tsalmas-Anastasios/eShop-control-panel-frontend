import { Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../../services/storage.service';
import { SessionDataObject, UserPrivilegesSettings } from '../../../../../models';

@Component({
  selector: 'app-sidebar-settings-layout',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public settings: NbMenuItem[] = [];


  constructor(
    public translate: TranslateService,
    private storageService: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    const user: SessionDataObject = this.storageService.getItem('user');


    let privileges: UserPrivilegesSettings;
    if (user?.privileges)
      privileges = new UserPrivilegesSettings().initializeUserPrivileges(user.privileges);
    else
      privileges = new UserPrivilegesSettings();






    this.settings = [
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.DASHBOARD').toPromise(),
        icon: 'arrow-ios-back-outline',
        link: '/dashboard',
        home: true,
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.PROFILE').toPromise(),
        icon: 'person',
        link: '/settings'
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.SETTINGS').toPromise(),
        group: true,
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.COMPANY').toPromise(),
        icon: 'home',
        link: '/settings/company',
        hidden: !user?.is_account && !privileges?.company_data_read && !privileges?.company_data_edit
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.WAREHOUSES').toPromise(),
        icon: 'cube',
        expanded: false,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.LIST').toPromise(),
            icon: 'list-outline',
            link: '/settings/warehouses',
            hidden: !user?.is_account && !privileges?.warehouses_read && !privileges?.warehouses_edit && !privileges.warehouses_new,
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.ADD_NEW').toPromise(),
            icon: 'plus-circle',
            link: '/settings/warehouses/new',
            hidden: !user?.is_account && !privileges?.warehouses_new
          }
        ]
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.USERS').toPromise(),
        icon: 'people',
        expanded: false,
        hidden: !user?.is_account && !privileges.users_read && !privileges.users_edit && !privileges.users_add_new,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.LIST').toPromise(),
            icon: 'list-outline',
            hidden: !user?.is_account && !privileges.users_read && !privileges.users_edit,
            link: '/settings/connected-users',
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.ADD_NEW').toPromise(),
            hidden: !user?.is_account && !privileges.users_add_new,
            icon: 'person-add',
            link: '/settings/connected-users/new',
          }
        ]
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.INTEGRATIONS').toPromise(),
        icon: 'repeat-outline',
        expanded: false,
        hidden: !user?.is_account && !privileges?.integrations_read && !privileges?.integrations_edit && !privileges?.integrations_new,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.COMPANY_EMAILS').toPromise(),
            icon: 'email-outline',
            link: '/settings/integrations/company-emails',
          }
        ]
      }
    ];


  }

}
