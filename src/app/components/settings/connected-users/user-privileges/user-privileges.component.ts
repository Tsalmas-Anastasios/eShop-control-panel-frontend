import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { User, UserPrivilege, UserPrivilegesSettings } from '../../../../models';

@Component({
  selector: 'app-settings-user-privileges',
  templateUrl: './user-privileges.component.html',
  styleUrls: ['./user-privileges.component.scss']
})
export class UserPrivilegesComponent implements OnInit {

  @Input() user_privileges: UserPrivilegesSettings;
  @Input() mode: 'edit' | 'preview';

  @Output() updateUserPrivileges: EventEmitter<UserPrivilegesSettings> = new EventEmitter<UserPrivilegesSettings>();


  public categories_handler: {
    orders: boolean;
    products: boolean;
    product_categories: boolean;
    company_data: boolean;
    users: boolean;
    integrations: boolean;
    warehouses: boolean;
    contacts: boolean;
  } = {
      orders: false,
      products: false,
      product_categories: false,
      company_data: false,
      users: false,
      integrations: false,
      warehouses: false,
      contacts: false,
    };

  private read_modify_categories = ['company_data'];
  private add_new_categories = ['users'];


  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {


    // handle the check-all per category
    for (const category in this.categories_handler)
      if (this.read_modify_categories.includes(category)
        && (this.user_privileges[`${category}_read`] && this.user_privileges[`${category}_edit`]))
        this.categories_handler[category] = true;
      else
        if (this.user_privileges[`${category}_read`]
          && (this.user_privileges[`${category}_new`] || this.user_privileges[`${category}_add_new`])
          && this.user_privileges[`${category}_edit`])
          this.categories_handler[category] = true;



  }


  onUpdateUserPrivileges(field: string, event?: 'all' | 'single', category?: string): void {


    if (!event || event === 'single') {

      this.user_privileges[field] = !this.user_privileges[field];

      const privilege_category_title = field.split('_')[0];


      if (!this.user_privileges[field])
        this.categories_handler[privilege_category_title] = false;

      if (!this.read_modify_categories.includes(privilege_category_title)) {
        if (this.user_privileges[`${privilege_category_title}_read`]
          && (this.user_privileges[`${privilege_category_title}_new`] || this.user_privileges[`${privilege_category_title}_add_new`])
          && this.user_privileges[`${privilege_category_title}_edit`])
          this.categories_handler[privilege_category_title] = true;
      } else
        if (this.user_privileges[`${privilege_category_title}_read`]
          && this.user_privileges[`${privilege_category_title}_edit`])
          this.categories_handler[privilege_category_title] = true;



      const splitted_field = field.split('_');

      // handle if the check is edit
      if (splitted_field[1] === 'edit' && this.user_privileges[field])
        this.user_privileges[`${splitted_field[0]}_read`] = true;

      // handle if the check is read
      if (splitted_field[1] === 'read' && !this.user_privileges[field])
        this.user_privileges[`${splitted_field[0]}_edit`] = false;


    } else
      this.user_privileges[field] = this.categories_handler[category];

    this.updateUserPrivileges.emit(this.user_privileges);
  }


  updateAllCategoryPrivileges(category: string): void {
    this.categories_handler[category] = !this.categories_handler[category];


    this.onUpdateUserPrivileges(`${category}_read`, 'all', category);

    if (!this.add_new_categories.includes(category))
      this.onUpdateUserPrivileges(`${category}_new`, 'all', category);
    else
      this.onUpdateUserPrivileges(`${category}_add_new`, 'all', category);

    this.onUpdateUserPrivileges(`${category}_edit`, 'all', category);
  }

}
