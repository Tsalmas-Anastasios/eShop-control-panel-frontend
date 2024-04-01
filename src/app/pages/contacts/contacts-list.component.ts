import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from '../../services/seo.service';
import { StorageService } from '../../services/storage.service';
import { UtilsService } from '../../services/utils.service';
import { Contact, ContactLabelName, SessionDataObject, UserPrivilegesSettings } from '../../models';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-contacts-list',
  templateUrl: './contacts-list.component.html',
  styleUrls: ['./contacts-list.component.scss']
})
export class ContactsListComponent implements OnInit {

  public contacts_public: Contact[] = [];
  public contacts_private: Contact[] = [];
  public contacts: Contact[] = [];
  public contact_labels: ContactLabelName[] = [];

  public only_private_contacts: boolean;

  public user: SessionDataObject;
  public user_privileges: UserPrivilegesSettings;

  public page_mode: 'private' | 'public' = 'private';
  public active_label_filter: string;

  public display_favorites = false;



  private contacts_loading: {
    private: boolean;
    public: boolean;
  } = {
      private: false,
      public: false
    };


  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storageService: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.CONTACTS.TAB_TITLE_PRIVATE').toPromise() });


    this.user_privileges = this.utilsService.getUsersPrivileges();
    this.user = this.storageService.getItem('user');


    if (!this.user_privileges?.contacts_read)
      this.only_private_contacts = true;
    else
      this.only_private_contacts = false;


    Promise.all([
      await this.fetchContacts('private'),
      await this.fetchContactLabels(),
    ]);

  }




  async fetchContacts(type: 'public' | 'private'): Promise<void> {


    if (type === 'public')
      this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.CONTACTS.TAB_TITLE_PUBLIC').toPromise() });
    else
      this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.CONTACTS.TAB_TITLE_PRIVATE').toPromise() });


    this.page_mode = type;


    if (type === 'public' && this.contacts_loading.public) {
      this.contacts = this.contacts_public;
      this.display_favorites = false;
      return Promise.resolve();
    }

    if (type === 'private' && this.contacts_loading.private) {
      this.contacts = this.contacts_private;
      this.display_favorites = false;
      return Promise.resolve();
    }


    this.spinner.show();


    let request_params = '';
    if (type === 'private')
      request_params += `private=1&private_user_id=${this.user.user_id}`;




    try {

      this.contacts = await this.http.get<Contact[]>(`${environment.params.host}/api/manage/contacts/specific-list?${request_params}`).toPromise();



      if (!environment.production)
        console.log(this.contacts);



      if (type === 'private') {
        this.contacts_private = [...this.contacts];
        this.contacts_loading.private = true;
      } else {
        this.contacts_public = [...this.contacts];
        this.contacts_loading.public = true;
      }

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }



    this.spinner.hide();

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



  redirectToContact(contact_id: string, redirect_for_edit?: boolean): void {

    if (redirect_for_edit)
      this.router.navigate([`/dashboard/contacts/${contact_id}`], { queryParams: { mode: 'edit' } });
    else
      this.router.navigate([`/dashboard/contacts/${contact_id}`]);

  }



  // toggle favorite star
  async onToggleFavoriteStarExisting(index: number): Promise<void> {

    try {

      this.contacts[index].favorite = !this.contacts[index].favorite;

      let message: string;
      if (this.contacts[index].favorite)
        message = await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_REMOVED_FROM_FAVORITES').toPromise();
      else
        message = await this.translate.get('VIEWS.CONTACT_PAGE.ALERTS.CONTACT_ADDED_TO_FAVORITES').toPromise();

      const response = await this.http.put(`${environment.params.host}/api/manage/contacts/${this.contacts[index].contact_id}/p/favorite`, { favorite: this.contacts[index].favorite }).toPromise();


      this.contacts[index] = { ...this.contacts[index] };


      if (this.page_mode === 'private')
        this.contacts_private[index] = { ...this.contacts[index] };
      else
        this.contacts_public[index] = { ...this.contacts[index] };


      this.utilsService.showToast({
        message: message,
        type: 'success'
      });

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }


  // show / hide favorites
  toggleFavoritesContacts(): void {

    this.display_favorites = !this.display_favorites;
    this.active_label_filter = null;

    if (this.page_mode === 'private')
      this.contacts = [...this.contacts_private];
    else
      this.contacts = [...this.contacts_public];



    if (this.display_favorites)
      this.contacts = this.utilsService.lodash.filter(this.contacts, 'favorite');

  }


  toggleLabelFilters(label_id?: string, erase?: boolean): void {

    this.display_favorites = false;

    if (this.page_mode === 'private')
      this.contacts = [...this.contacts_private];
    else
      this.contacts = [...this.contacts_public];


    if (erase) {
      this.active_label_filter = null;
      return;
    }


    const tmp_contacts: Contact[] = [];
    for (const contact of this.contacts)
      for (const label of contact.contact_labels)
        if (label.label_id === label_id) {
          tmp_contacts.push(contact);
          break;
        }



    this.contacts = [...tmp_contacts];
    this.active_label_filter = label_id;

  }

}
