import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Contact, ContactAddressData, ContactCustomFields, ContactEmailData, ContactLabelName, ContactPhoneData, SessionDataObject, UserPrivilegesSettings } from '../../models';
import { environment } from '../../../environments/environment';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { NbTagComponent } from '@nebular/theme';
import { UtilsService } from '../../services/utils.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class ContactFormComponent implements OnInit, OnChanges {

  @Input() mode: 'preview' | 'edit' | 'new';
  @Input() contact: Contact;
  @Input() contact_labels: ContactLabelName[];
  @Input() only_private_contact: boolean;
  @Input() user: SessionDataObject;
  @Input() user_privileges: UserPrivilegesSettings;
  @Output() contactDataChange: EventEmitter<Contact> = new EventEmitter<Contact>();
  @Output() changeContactImage: EventEmitter<File> = new EventEmitter<File>();
  @Output() addNewContactLabel: EventEmitter<string> = new EventEmitter<string>();
  @Output() toggleFavoriteStarExisting: EventEmitter<void> = new EventEmitter<void>();

  public contact_saving_type: 'personal' | 'public' = 'personal';
  public contact_types = environment.params.arrays.contacts.types;
  public countries = environment.params.arrays.countries;

  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;
  public phones: any[] = [];
  public telephone_one: any;

  public tmp_contact_labels: ContactLabelName[] = [];
  public new_contacts_label: string;



  constructor(
    public translate: TranslateService,
    public utilsService: UtilsService
  ) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.contact = changes?.contact ? changes.contact.currentValue : this.contact;
    this.contact_labels = changes?.contact_labels ? changes.contact_labels.currentValue : this.contact_labels;


    if (changes?.contact)
      for (const phone of this.contact.phones)
        this.phones.push(phone.phone);


    if (this.mode === 'new') {
      this.contact.private = true;
      this.contact.private_user_id = this.user.user_id;
    } else
      if (!this.contact?.private)
        this.contact_saving_type = 'public';


  }



  changeContactType(): void {

    if (this.contact_saving_type === null || this.contact_saving_type === 'personal') {
      this.contact.private = true;
      this.contact.private_user_id = this.user.user_id;
    } else {
      this.contact.private = false;
      this.contact.private_user_id = null;
    }


    this.contactDataChange.emit(this.contact);

  }


  addNewAddress(): void {

    if (!this.contact?.addresses || this.contact.addresses.length <= 0)
      this.contact.addresses = [];


    this.contact.addresses.push(new ContactAddressData());

  }

  deleteAddress(index: number): void {
    this.contact.addresses.splice(index, 1);
    this.contactDataChange.emit(this.contact);
  }


  addNewPhone(): void {

    if (this.contact.phones.length <= 0)
      this.contact.phones = [];

    if (this.phones.length <= 0)
      this.phones = [];

    const new_phone = new ContactPhoneData();
    this.contact.phones.push(new_phone);
    this.phones.push(this.telephone_one);

  }

  deletePhone(index: number): void {

    this.contact.phones.splice(index, 1);
    this.phones.splice(index, 1);
    this.contactDataChange.emit(this.contact);

  }

  formatTelephone(index: number) {
    this.contact.phones[index].phone = this.phones[index]?.internationalNumber || null;
    this.contactDataChange.emit(this.contact);
  }


  addNewEmail(): void {

    if (this.contact.emails.length <= 0)
      this.contact.emails = [];


    this.contact.emails.push(new ContactEmailData());

  }

  deleteEmail(index: number): void {
    this.contact.emails.splice(index, 1);
    this.contactDataChange.emit(this.contact);
  }


  addNewCustomField(): void {

    if (this.contact.custom_fields.length <= 0)
      this.contact.custom_fields = [];

    this.contact.custom_fields.push(new ContactCustomFields());

  }

  deleteCustomField(index: number): void {

    this.contact.custom_fields.splice(index, 1);
    this.contactDataChange.emit(this.contact);

  }


  onContactProfileImageChange(event): void {

    if (event?.target?.files && event.target.files.length > 0) {

      const file = event.target.files[0];


      if (!environment.production)
        console.log(file);


      const reader = new FileReader();

      reader.onload = async (e) => {

        file.url = e.target.result;
        this.contact.image_url = file.url;

      };


      reader.readAsDataURL(file);

      this.changeContactImage.emit(file);

    }

  }


  toggleFavoriteStar(): void {
    this.contact.favorite = !this.contact.favorite;
    this.contactDataChange.emit(this.contact);
  }


  addContactLabel(label_id: string): void {

    if (this.tmp_contact_labels.length === 0)
      this.tmp_contact_labels = [...this.contact_labels];

    for (const label of this.contact_labels)
      if (label.label_id === label_id) {
        this.contact.contact_labels.push(label);
        break;
      }


    this.contact_labels = this.contact_labels.filter(cl => cl.label_id !== label_id);

    this.contactDataChange.emit(this.contact);

  }

  removeContactLabel(label: NbTagComponent): void {

    this.contact.contact_labels = this.contact.contact_labels.filter(cl => cl.label !== label.text);

    for (const cl of this.tmp_contact_labels)
      if (cl.label === label.text) {
        this.contact_labels.push(cl);
        break;
      }


    this.contactDataChange.emit(this.contact);

  }

}
