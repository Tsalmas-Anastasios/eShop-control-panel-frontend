import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { NbMenuItem } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from '../../../../../services/storage.service';
import { SessionDataObject, UserPrivilegesSettings } from '../../../../../models';


@Component({
  selector: 'app-sidebar-dashboard',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {

  public dashboard: NbMenuItem[] = [];


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



    this.dashboard = [
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.DASHBOARD').toPromise(),
        icon: 'pantone',
        link: '/dashboard',
        home: true,
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.FRONT_OFFICE').toPromise(),
        group: true,
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.ORDERS').toPromise(),
        icon: 'shopping-bag',
        expanded: false,
        hidden: !user?.is_account && !privileges?.orders_read && !privileges?.orders_edit && !privileges?.orders_new,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SEARCH_ORDERS').toPromise(),
            icon: 'search-outline',
            link: '/dashboard/search/orders',
            hidden: !user?.is_account && !privileges?.orders_read
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.ORDERS').toPromise(),
            icon: 'list-outline',
            link: '/dashboard/orders',
            hidden: !user?.is_account && !privileges?.orders_read
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.CASH_REGISTER').toPromise(),
            icon: 'monitor',
            link: '/dashboard/cash-register',                    // angular router link
            hidden: !user?.is_account && !privileges?.orders_new,
          }
        ]
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.PRODUCTS').toPromise(),
        icon: 'pricetags-outline',
        expanded: false,
        hidden: !user?.is_account && !privileges?.products_read && !privileges?.products_edit && !privileges?.products_new && !privileges?.product_categories_read && !privileges?.product_categories_edit && !privileges?.product_categories_new,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SEARCH_PRODUCTS').toPromise(),
            icon: 'search-outline',
            link: '/dashboard/search/products',
            hidden: !user?.is_account && !privileges?.products_read
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.PRODUCTS').toPromise(),
            icon: 'list-outline',
            link: '/dashboard/products',                    // angular router link
            hidden: !user?.is_account && !privileges?.products_read
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.ADD').toPromise(),
            icon: 'plus-circle',
            link: '/dashboard/products/new',                    // angular router link
            hidden: !user?.is_account && !privileges?.products_new
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.PRODUCT_CATEGORIES').toPromise(),
            icon: 'hash-outline',
            expanded: false,
            hidden: !user?.is_account && !privileges?.product_categories_read && !privileges?.product_categories_edit && !privileges?.product_categories_new,
            children: [
              {
                title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.PRODUCT_CATEGORIES').toPromise(),
                icon: 'list-outline',
                link: '/dashboard/product-categories',                    // angular router link
                hidden: !user?.is_account && !privileges?.product_categories_read
              },
              {
                title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.ADD').toPromise(),
                icon: 'plus-circle',
                link: '/dashboard/product-categories/new',                    // angular router link
                hidden: !user?.is_account && !privileges?.product_categories_new
              },
            ]
          }
        ]
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.BACK_OFFICE').toPromise(),
        group: true,
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.PRODUCTS_INVENTORY').toPromise(),
        icon: 'archive',
        expanded: false,
        hidden: false,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.INVENTORIES').toPromise(),
            icon: 'list-outline',
            link: '/dashboard/product-inventories',
            hidden: false,
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.SETTINGS.SETTINGS').toPromise(),
            icon: 'settings-2-outline',
            link: '/dashboard/product-inventories/settings',
            hidden: false,
          }
        ]
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.MANAGEMENT').toPromise(),
        group: true,
      },
      {
        title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.CONTACTS').toPromise(),
        icon: 'people',
        expanded: false,
        children: [
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.CONTACTS').toPromise(),
            icon: 'list-outline',
            link: '/dashboard/contacts'
          },
          {
            title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.ADD').toPromise(),
            icon: 'plus-circle',
            link: '/dashboard/contacts/new',
          }
        ],
      },
      // {
      //   title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.EMPLOYEES').toPromise(),
      //   icon: 'briefcase',
      //   expanded: false,
      //   children: [
      //     {
      //       title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.EMPLOYEES').toPromise(),
      //       icon: 'list-outline',
      //       link: '',
      //     },
      //     {
      //       title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.ADD').toPromise(),
      //       icon: 'plus-circle',
      //       link: '',
      //     },

      //   ]
      // },
      // {
      //   title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.CUSTOMER_SUPPORT').toPromise(),
      //   group: true,
      // },
      // {
      //   title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.CUSTOMER_SUPPORT').toPromise(),
      //   icon: 'headphones',
      //   expanded: false,
      //   children: [
      //     {
      //       title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.CUSTOMER_REQUESTS').toPromise(),
      //       icon: 'shake',
      //       link: ''
      //     },
      //     {
      //       title: await this.translate.get('GENERIC.LAYOUT.SIDEBAR.NEWSLETTER').toPromise(),
      //       icon: 'email-outline',
      //       link: '',
      //     },
      //   ]
      // }
    ];


  }

}
