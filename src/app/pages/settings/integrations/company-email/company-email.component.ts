import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../../services/seo.service';
import { UtilsService } from '../../../../services/utils.service';
import { StorageService } from '../../../../services/storage.service';
import { environment } from '../../../../../environments/environment';
import {
  CompanyEmailData, CompanyEmailDataExtendedActions, DataTableCustomModuleHeaders, DataTableCustomModuleOptions,
  SessionDataObject,
  UserPrivilegesSettings
} from '../../../../models';

@Component({
  selector: 'app-company-email',
  templateUrl: './company-email.component.html',
  styleUrls: ['./company-email.component.scss']
})
export class CompanyEmailComponent implements OnInit {

  public user: SessionDataObject;
  public company_emails: CompanyEmailDataExtendedActions[] = [];
  public company_email: CompanyEmailDataExtendedActions = new CompanyEmailDataExtendedActions();
  public columnHeaders: DataTableCustomModuleHeaders[] = [];
  public companyEmailTableOptions: DataTableCustomModuleOptions = environment.custom_dtTables;
  public connection_testing: 'none' | 'testing' | 'success' | 'error' | 'saving' = 'none';
  public isSaving = false;
  public editModalShow = false;

  public user_privileges: UserPrivilegesSettings;


  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private seo: SeoService,
    private utilsService: UtilsService,
    private storage: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.spinner.show();


    this.user = this.storage.getItem('user');
    this.user_privileges = this.utilsService.getUsersPrivileges();


    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.TAB_TITLE').toPromise() });



    // table headers
    this.columnHeaders = [
      { title: '#', field: 'category_index', auto_increment: true, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.EMAIL_ID').toPromise(), field: 'email_id', auto_increment: false, identifier: true, width: 'calc(calc(100% - 270px) / 6)' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.EMAIL_LABEL').toPromise(), field: 'email_label_action', auto_increment: false, identifier: true, width: 'calc(calc(100% - 270px) / 6)' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.HOST').toPromise(), field: 'host', auto_increment: false, identifier: true, width: 'calc(calc(100% - 270px) / 6)' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.PORT').toPromise(), field: 'port', auto_increment: false, identifier: true, width: '90px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.USER').toPromise(), field: 'user', auto_increment: false, identifier: true, width: 'calc(calc(100% - 270px) / 6)' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.NAME').toPromise(), field: 'default_name', auto_increment: false, identifier: true, width: 'calc(calc(100% - 270px) / 6)' },
      { title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.EMAIL').toPromise(), field: 'default_email', auto_increment: false, identifier: true, width: 'calc(calc(100% - 270px) / 6)' },
      { title: '', field: 'quick_action__edit', auto_increment: false, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' },
    ];


    if (this.user_privileges?.integrations_edit)
      this.columnHeaders.push({ title: '', field: 'quick_action__delete', auto_increment: false, identifier: false, width: '60px', text_align: 'center', header_text_align: 'header-center', header_text_fields_text_align: 'center' });




    // get emails
    try {

      const emails: CompanyEmailData[] = await this.http.get<CompanyEmailData[]>(`${environment.params.host}/api/account/settings/company-emails`).toPromise();
      this.initializeCompanyEmailsOptions(emails);

      if (!environment.production)
        console.log(emails);

    } catch (error) {

      this.spinner.hide();
      await this.utilsService.standardErrorHandling(error);

    }



    this.spinner.hide();

  }





  // initialize for dtTable
  initializeCompanyEmailsOptions(emails: CompanyEmailData[]): void {

    for (let i = 0; i < emails.length; i++) {
      const email = {
        ...emails[i],
        email_label_action: {
          label: 'field email_label',
          run_function: this.quick_actions__edit_email,
          parameters: {
            email_id: 'email_id',
          },
          event: 'click'
        },
      };


      if (!this.user_privileges?.users_edit)
        email[`quick_action__edit`] = {
          label: '<i class="fas fa-eye"></i>',
          run_function: this.quick_actions__edit_email,
          parameters: {
            email_id: 'email_id',
          },
          event: 'click',
        };
      else {
        email['quick_action__edit'] = {
          label: '<i class="fas fa-edit"></i>',
          run_function: this.quick_actions__edit_email,
          parameters: {
            email_id: 'email_id',
          },
          event: 'click',
          letters_color: '#229D18'
        };
        email['quick_action__delete'] = {
          label: '<i class="fas fa-trash"></i>',
          run_function: this.quick_actions__delete_email,
          parameters: {
            email_id: 'email_id',
          },
          event: 'click',
          letters_color: '#cc0000'
        };
      }

      this.company_emails.push(email);

    }


    this.company_emails = [...this.company_emails];


    if (!environment.production)
      console.log(this.company_emails);

  }





  // open modal to edit email
  public quick_actions__edit_email = (parameters: { email_id: string }) => {
    for (const email of this.company_emails)
      if (email.email_id === parameters.email_id) {
        this.company_email = new CompanyEmailDataExtendedActions(email);
        break;
      }

    this.editModalShow = true;
  }

  // edit modal close
  closeEditModal(): void {
    this.editModalShow = false;
  }


  // delete email
  public quick_actions__delete_email = async (parameters: { email_id: string }) => {

    let email_data: CompanyEmailDataExtendedActions;
    let index = -1;
    for (const email of this.company_emails) {
      index++;
      if (email.email_id === parameters.email_id) {
        email_data = { ...email };
        break;
      }
    }



    this.utilsService.swal.fire({
      title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.ALERTS.EMAIL_DELETION').toPromise(),
      html: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.ALERTS.SURE_DELETE_EMAIL', { email_user: email_data.user }).toPromise(),
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

        const response = await this.http.delete<any>(`${environment.params.host}/api/account/settings/company-emails/${email_data.email_id}`).toPromise();

      } catch (error) {
        this.spinner.hide();

        this.spinner.hide();
        await this.utilsService.standardErrorHandling(error);

      }



      window.location.reload();

    });


  }





  // test connection for company email
  async companyEmailTesting(): Promise<void> {

    this.connection_testing = 'testing';

    try {

      this.company_email.default_email = this.company_email.user;

      const response = await this.http.post<any>(`${environment.params.host}/api/account/settings/company-emails/test/test-email`, this.company_email).toPromise();


      this.connection_testing = 'success';

    } catch (error) {
      this.connection_testing = 'error';

      if (!environment.production)
        console.log(error);
    }

  }



  formatConnectionTesting(): void {
    this.connection_testing = 'none';
  }



  // save new email
  async saveNewEmail(): Promise<void> {

    this.isSaving = true;

    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/account/settings/company-emails/new`, this.company_email).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.ALERTS.NEW_EMAIL_SAVED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.ALERTS.NEW_COMPANY_EMAIL_SAVED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      this.isSaving = false;

      this.spinner.hide();
      await this.utilsService.standardErrorHandling(error);

    }


    this.isSaving = false;

  }



  // update email data
  async updateEmail(): Promise<void> {

    this.isSaving = true;

    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/account/settings/company-emails/${this.company_email.email_id}`, this.company_email).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.ALERTS.EMAIL_UPDATED').toPromise(),
        html: await this.translate.get('VIEWS.SETTINGS.INTEGRATIONS.COMPANY_EMAIL.ALERTS.EMAIL_UPDATED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000,
      }).then(() => {
        window.location.reload();
      });

    } catch (error) {
      this.isSaving = false;

      this.spinner.hide();
      await this.utilsService.standardErrorHandling(error);

    }


    this.isSaving = false;

  }

}
