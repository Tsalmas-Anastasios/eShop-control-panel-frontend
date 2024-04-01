
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxDropzoneChangeEvent } from 'ngx-dropzone';
import { UtilsService } from '../../../services/utils.service';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';
import { Company, Country, SessionDataObject, UserPrivilegesSettings } from '../../../models';
import { environment } from '../../../../environments/environment';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import slugify from 'slugify';

@Component({
  selector: 'app-company-data',
  templateUrl: './company-data.component.html',
  styleUrls: ['./company-data.component.scss']
})
export class CompanyDataComponent implements OnInit {

  public user: SessionDataObject;
  public company_data: Company;
  public shop_types = environment.params.arrays.shop_types;
  public coins = environment.params.arrays.supported_coins;
  public chosen_coin: string;
  private logo_changed: 'filled' | 'blank' | 'static';
  public isSubmitting = false;
  public slug_exists = false;

  public countries: Country[] = environment.params.arrays.countries;
  public timeslots = environment.params.arrays.timeslots;

  public user_privileges: UserPrivilegesSettings;


  // for telephone input
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;
  public contact_telephone: any;
  public company_telephone: any;


  // shop logo config
  public imageMaxFileSize = environment.params.imagesMaxFileSize;
  public shopLogoFile: File[] = [];

  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storage: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.spinner.show();

    this.user = this.storage.getItem('user');

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.SETTINGS.COMPANY_DATA.TAB_TITLE').toPromise() });


    this.user_privileges = this.utilsService.getUsersPrivileges();


    // get company data here
    try {
      this.company_data = await this.http.get<Company>(`${environment.params.host}/api/settings/company-data/get`).toPromise();
      if (this.company_data === null) {
        this.company_data = new Company();
        this.logo_changed = 'blank';
      } else {
        this.logo_changed = 'static';
        this.contact_telephone = this.company_data.contact_phone;
        this.company_telephone = this.company_data.company_phone;
        this.chosen_coin = this.company_data.coin_value;
        this.shopLogoFile[0] = await this.http.get<File>(this.company_data.shop_logo).toPromise();
      }


      if (!environment.production)
        console.log(this.company_data);

    } catch (error) {
      await this.utilsService.standardErrorHandling(error);
    }



    this.spinner.hide();

  }






  // format telephone
  formatTelephone(final_object: any, final_object_field: string, telephone_var: any): void {
    this[final_object][final_object_field] = telephone_var?.internationalNumber || null;
  }



  coinChoosingChange(): void {
    for (const coin of this.coins)
      if (coin.value === this.chosen_coin) {
        this.company_data.coin_symbol = coin.coin_symbol;
        this.company_data.coin_label = coin.coin_label;
        this.company_data.coin_description = coin.coin_description;
        this.company_data.coin_correspondence_in_eur = coin.coin_correspondence_in_eur;
        this.company_data.coin_value = coin.value;
        break;
      }
  }




  // save temporary the file of shop logo
  async onShopLogoFileSelect(event: NgxDropzoneChangeEvent): Promise<void> {

    if (event?.addedFiles && event.addedFiles.length > 0) {

      const file = event.addedFiles[0] as any;

      if (file.size > environment.params.imagesMaxFileSize) {
        this.utilsService.showToast({
          message: await this.translate.get('VIEWS.SETTINGS.COMPANY.ALERTS.INVALID.TOO_LARGE_SIZE_IMAGE', { imagesMaxFileSize: environment.params.imagesMaxFileSize / 1024 / 1024, name: file.name, }).toPromise(),
          type: 'error',
        });

        return;
      }




      // pushing file here
      const reader = new FileReader();
      reader.onload = async (e) => {

        file.url = e.target.result;
        this.shopLogoFile.splice(0, 1);
        this.shopLogoFile.push(file);


        if (!environment.production)
          console.log(this.shopLogoFile);

      };

      reader.readAsDataURL(file);


      this.logo_changed = 'filled';

    }

  }


  onShopLogoFileRemove(): void {
    this.shopLogoFile = [];
    this.logo_changed = 'blank';
  }





  // save form's data
  async submitForm(): Promise<void> {


    this.isSubmitting = true;

    if (this.logo_changed === 'blank') {
      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.SETTINGS.COMPANY_DATA.ALERTS.INVALID.PLEASE_UPLOAD_YOUR_LOGO_BEFORE_SUBMITTING_THE_FORM').toPromise(),
        type: 'error',
      });

      this.isSubmitting = false;

      return;
    }

    try {

      const reqHeaders: HttpHeaders = new HttpHeaders();
      reqHeaders.append('Content-Type', 'multipart/form-data');

      const formData = new FormData();

      // Image to send
      formData.append('company_logo', this.shopLogoFile[0], this.shopLogoFile[0].name);




      let response = null;
      let message = '';
      if (!this.company_data?.rec_id) {
        const save_logo_response = await this.http.post<any>(`${environment.params.host}/api/settings/company-data/save-logo`, formData, { headers: reqHeaders }).toPromise();
        this.company_data.shop_logo = save_logo_response.file_url;
        response = await this.http.post<any>(`${environment.params.host}/api/settings/company-data/add-new-rec`, this.company_data).toPromise();
        this.company_data.rec_id = response.rec_id;


        message = await this.translate.get('VIEWS.SETTINGS.COMPANY_DATA.ALERTS.YOUR_COMPANY_DATA_WAS_SUCCESSFULLY_SUBMITTED_AND_SAVED').toPromise();
      } else {
        // here update the records
        if (this.logo_changed === 'filled') {
          const save_logo_response = await this.http.post<any>(`${environment.params.host}/api/settings/company-data/save-logo`, formData, { headers: reqHeaders }).toPromise();
          this.company_data.shop_logo = save_logo_response.file_url;
        }

        response = await this.http.put<any>(`${environment.params.host}/api/settings/company-data/update/${this.company_data.rec_id}`, this.company_data).toPromise();

        message = await this.translate.get('VIEWS.SETTINGS.COMPANY_DATA.ALERTS.YOUR_COMPANY_DATA_WAS_SUCCESSFULLY_SUBMITTED_AND_UPDATED').toPromise();
      }



      // update storage
      this.user.company_data = { ...this.company_data };
      this.storage.removeItem('user');
      this.storage.setItem('user', this.user);



      this.utilsService.swal.fire({
        title: await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise(),
        html: message,
        icon: 'success',
        showConfirmButton: false,
        timer: 3000
      });

    } catch (error) {
      this.isSubmitting = false;

      await this.utilsService.standardErrorHandling(error);
    }



    this.isSubmitting = false;
  }





  async createCompanyShopSlug(type: 'auto_change' | 'manual'): Promise<void> {

    if (type === 'auto_change') {
      this.company_data.slug = slugify(this.company_data.shop_name.toLowerCase());


      let exists = true;

      while (exists) {

        try {
          const response = await this.http.get<{ exists: boolean }>(`${environment.params.host}/api/settings/company-data/slug/check-exists?new_slug=${this.company_data.slug}`).toPromise();

          exists = response.exists;

        } catch (error) {
          await this.utilsService.standardErrorHandling(error);
        }


        if (exists)
          this.company_data.slug = `${this.company_data.slug}-${this.utilsService.generateId({ length: 4, nanoid_alphabet: environment.params.nanoid_alphabet_mini_letters })}`;

      }


    } else if (type === 'manual') {

      let exists = true;

      try {
        const response = await this.http.get<{ exists: boolean }>(`${environment.params.host}/api/settings/company-data/slug/check-exists?new_slug=${this.company_data.slug}`).toPromise();

        exists = response.exists;

      } catch (error) {
        await this.utilsService.standardErrorHandling(error);
      }


      this.slug_exists = exists;

    }

  }


}
