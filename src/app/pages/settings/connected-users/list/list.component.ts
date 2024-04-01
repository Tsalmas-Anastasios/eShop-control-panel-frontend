import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from '../../../../services/utils.service';
import { environment } from '../../../../../environments/environment';
import { DataTableCustomModuleHeaders, DataTableCustomModuleOptions, SessionDataObject, User, UserPrivilegesSettings } from '../../../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-connected-users-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public primary_account: SessionDataObject;
  public connected_users: User[] = [];

  public columnHeaders: DataTableCustomModuleHeaders[] = [];
  public connectedUsersDataTableOptions: DataTableCustomModuleOptions = environment.custom_dtTables;

  public user_privileges: UserPrivilegesSettings;



  constructor(
    private router: Router,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private seo: SeoService,
    private utilsService: UtilsService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.spinner.show();


    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.TAB_TITLE').toPromise() });


    this.user_privileges = this.utilsService.getUsersPrivileges();



    // header columns for dtTable
    this.columnHeaders = [
      { title: '#', field: 'connected_users_index', auto_increment: true, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.USER_ID').toPromise(), field: 'id', auto_increment: false, identifier: true, width: 'calc(calc(100% - 180px) / 4)' },
      { title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.FULLNAME').toPromise(), field: 'fullname_quick_action', auto_increment: false, identifier: false, width: 'calc(calc(100% - 180px) / 4)' },
      { title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.EMAIL').toPromise(), field: 'email', auto_increment: false, identifier: false, width: 'calc(calc(100% - 180px) / 4)' },
      { title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.PHONE').toPromise(), field: 'phone', auto_increment: false, identifier: false, width: 'calc(calc(100% - 180px) / 4)' },
      { title: '', field: 'quick_actions__edit', auto_increment: false, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
    ];

    if (this.user_privileges?.users_edit)
      this.columnHeaders.push({ title: '', field: 'quick_actions__delete', auto_increment: false, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' });




    try {

      this.primary_account = await this.http.get<SessionDataObject>(`${environment.params.host}/api/settings/connected-users/primary-account`).toPromise();


      if (!environment.production)
        console.log(this.primary_account);

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }




    try {

      const users: User[] = await this.http.get<User[]>(`${environment.params.host}/api/settings/connected-users/list`).toPromise();
      this.initializeUsersDtTable(users);


      if (!environment.production)
        console.log(this.connected_users);

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }


    this.spinner.hide();

  }






  initializeUsersDtTable(users: User[]): void {

    this.connected_users = [];

    for (let i = 0; i < users.length; i++) {

      const connected_user = {
        ...users[i],
        full_name: `${users[i].first_name} ${users[i].last_name}`,
        fullname_quick_action: {
          label: 'field full_name',
          run_function: this.quick_actions__edit,
          parameters: {
            id: 'id'
          },
          event: 'click',
        },
      };


      if (!this.user_privileges?.users_edit)
        connected_user['quick_actions__edit'] = {
          label: '<i class="fas fa-eye"></i>',
          run_function: this.quick_actions__edit,
          parameters: {
            id: 'id'
          },
          event: 'click',
        };
      else {
        connected_user['quick_actions__edit'] = {
          label: '<i class="fas fa-edit"></i>',
          run_function: this.quick_actions__edit,
          parameters: {
            id: 'id'
          },
          event: 'click',
          letters_color: '#229D18'
        };
        connected_user['quick_actions__delete'] = {
          label: '<i class="fas fa-trash"></i>',
          run_function: this.quick_actions__delete,
          parameters: {
            id: 'id'
          },
          event: 'click',
          letters_color: '#cc0000'
        };
      }


      this.connected_users.push(connected_user);
    }


    this.connected_users = [...this.connected_users];


    if (!environment.production)
      console.log(this.connected_users);

  }






  public quick_actions__edit = (parameters: { id: string }) => {
    if (!this.user_privileges?.users_edit)
      this.router.navigate([`/settings/connected-users/${parameters.id}`]);
    else
      this.router.navigate([`/settings/connected-users/${parameters.id}`], { queryParams: { mode: 'edit' } });
  }

  public quick_actions__delete = async (parameters: { id: string }) => {

    let user_data: User;
    let index = -1;
    for (const user of this.connected_users) {
      index++;
      if (user.id === parameters.id) {
        user_data = { ...user };
        break;
      }
    }




    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.ALERTS.USER_REMOVAL').toPromise(),
      html: await this.translate.get('VIEWS.SETTINGS.CONNECTED_USERS.LIST.ALERTS.USER_REMOVAL_TEXT', { first_name: user_data.first_name, last_name: user_data.last_name }).toPromise(),
      showCancelButton: true,
      confirmButtonText: await this.translate.get('GENERIC.ACTIONS.DELETE').toPromise(),
      cancelButtonText: await this.translate.get('GENERIC.ACTIONS.CANCEL').toPromise(),
      confirmButtonColor: '#cc0000',
    }).then(async (result) => {

      if (result.isDismissed)
        return;


      this.spinner.show();


      // delete record
      try {

        const response = await this.http.delete<any>(`${environment.params.host}/api/settings/connected-users/user/${parameters.id}`).toPromise();

      } catch (error) {
        this.spinner.hide();

        this.spinner.hide();

        await this.utilsService.standardErrorHandling(error);
      }


      window.location.reload();

    });


  }


}
