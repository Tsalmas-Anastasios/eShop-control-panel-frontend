import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Contact, ContactLabel, ContactLabelName, SessionDataObject, UserPrivilegesSettings } from '../../../models';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { UtilsService } from '../../../services/utils.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {

  public mode: 'preview' | 'edit' | 'new';
  public contact_id: string;
  public contact: Contact;
  public contact_labels: ContactLabelName[] = [];

  public only_private_contacts: boolean;

  public user: SessionDataObject;
  public user_privileges: UserPrivilegesSettings;

  public isSaving = false;
  public isUpdating = false;
  public isDeleting = false;

  private new_image: File;



  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storageService: StorageService,
  ) { }

  ngOnInit(): void {


    this.user_privileges = this.utilsService.getUsersPrivileges();



    this.route.params.subscribe(async (params) => {

      if (params.contact_id === 'new') {
        this.mode = 'new';

        if (!this.user_privileges?.contacts_new)
          this.router.navigate(['/']);
      } else {
        this.contact_id = params.contact_id;

        this.route.queryParams.subscribe((queryParams) => {
          if (queryParams?.mode)
            if (queryParams.mode === 'edit' || queryParams.mode === 'preview')
              this.mode = queryParams.mode;
            else
              this.mode = 'preview';
          else
            this.mode = 'preview';
        });

      }



      this.spinner.show();



      this.user = this.storageService.getItem('user');



      if (this.mode === 'new') {
        this.contact = new Contact();

        if (!this.user_privileges?.contacts_new) {
          this.contact.private = true;
          this.contact.private_user_id = this.user.user_id;
        }

        await this.fetchContactLabels();

      } else {
        Promise.all([
          await this.fetchContactData(),
          await this.fetchContactLabels(),
        ]);


        if (!this.contact?.private) {

          if (!this.user_privileges?.contacts_edit)
            this.mode = 'preview';

          if (!this.user_privileges?.contacts_edit && !this.user_privileges?.contacts_read)
            this.router.navigate(['/']);

        }
      }


      if (this.mode === 'new')
        this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.CONTACT_PAGE.TAB_TITLE_NEW').toPromise() });
      else
        this.seo.updatePageMetadata({ title: `${this.contact?.name || ''} ${this.contact.surname || ''}` });


      this.spinner.hide();

    });


  }




  async fetchContactData(): Promise<void> {


    try {

      this.contact = await this.http.get<Contact>(`${environment.params.host}/api/manage/contacts/${this.contact_id}`).toPromise();


      if (!environment.production)
        console.log(this.contact);

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


  }



  async fetchContactLabels(): Promise<void> {

    try {

      this.contact_labels = await this.http.get<ContactLabelName[]>(`${environment.params.host}/api/manage/contacts/labels/names/list`).toPromise();



      if (!environment.production)
        console.log(this.contact_labels);

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }



  // update contact's data
  onContactDataChange(contact: Contact): void {
    this.contact = contact;
  }


  onChangeContactImage(photo: File): void {

    this.new_image = photo;


  }



  async onAddNewContactLabel(new_label: string): Promise<void> {

    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/manage/contacts/labels/names/new`, { label: new_label }).toPromise();

      const new_contact_label = new ContactLabelName({ label_id: response.label_id, label: new_label });
      this.contact.contact_labels.push(new_contact_label);
      this.contact = { ...this.contact };


      this.contact_labels.push(new_contact_label);
      this.contact_labels = { ...this.contact_labels };

    } catch (error) {

      if (error?.error?.code === 401) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_LABEL_EXISTS').toPromise(),
          type: 'warning',
        });

        return Promise.reject();
      }

      this.utilsService.standardErrorHandling(error);
    }

  }




  // save new contact
  async saveNewContact(): Promise<void> {

    this.isSaving = true;


    try {

      const response = await this.http.post<any>(`${environment.params.host}/api/manage/contacts/n/new`, { contact: this.contact }).toPromise();
      this.contact_id = response.contact_id;



      // insert image here
      if (this.new_image) {
        const reqHeaders: HttpHeaders = new HttpHeaders();
        reqHeaders.append('Content-Type', 'multipart/form-data');

        const formData = new FormData();
        formData.append('contact_photo', this.new_image, this.new_image.name);

        const image_response: any = await this.http.put<any>(`${environment.params.host}/api/manage/contacts/${this.contact_id}/p/photo-manage`, formData, { headers: reqHeaders }).toPromise();
      }


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_CREATED').toPromise(),
        html: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.NEW_CONTACT_CREATED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
      }).then(() => this.router.navigate(['/dashboard/contacts']));

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.isSaving = false;

  }


  // update existing contact
  async updateExistingContact(): Promise<void> {

    this.isUpdating = true;


    try {

      const response = await this.http.put<any>(`${environment.params.host}/api/manage/contacts/${this.contact_id}`, { contact: this.contact }).toPromise();


      // insert image here
      if (this.new_image) {
        const reqHeaders: HttpHeaders = new HttpHeaders();
        reqHeaders.append('Content-Type', 'multipart/form-data');

        const formData = new FormData();
        formData.append('contact_photo', this.new_image, this.new_image.name);

        const image_response: any = await this.http.put<any>(`${environment.params.host}/api/manage/contacts/${this.contact_id}/p/photo-manage`, formData, { headers: reqHeaders }).toPromise();
      }


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_UPDATED').toPromise(),
        html: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_UPDATED_TEXT').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
      }).then(() => this.router.navigate([`/dashboard/contacts/${this.contact_id}`]));

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.isUpdating = false;

  }


  // toggle favorite star
  async onToggleFavoriteStarExisting(): Promise<void> {

    try {

      this.contact.favorite = !this.contact.favorite;

      let message: string;
      if (this.contact.favorite)
        message = await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_REMOVED_FROM_FAVORITES').toPromise();
      else
        message = await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_ADDED_TO_FAVORITES').toPromise();

      const response = await this.http.put(`${environment.params.host}/api/manage/contacts/${this.contact_id}/p/favorite`, { favorite: this.contact.favorite }).toPromise();


      this.contact = { ...this.contact };



      this.utilsService.showToast({
        message: message,
        type: 'success'
      });

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }


  // delete existing contact
  async deleteExistingContact(): Promise<void> {

    this.isDeleting = true;


    try {

      const response = await this.http.delete<any>(`${environment.params.host}/api/manage/contacts/${this.contact_id}/p/favorite`).toPromise();


      this.utilsService.swal.fire({
        title: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_DELETED').toPromise(),
        html: await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_DELETED_SUCCESSFULLY').toPromise(),
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
      }).then(() => this.router.navigate(['/dashboard/contacts']));

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }


    this.isDeleting = false;

  }

}
