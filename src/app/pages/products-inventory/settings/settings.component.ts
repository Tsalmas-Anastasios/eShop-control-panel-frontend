import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import { ProductsInventoriesSettings, SessionDataObject } from '../../../models';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { UtilsService } from '../../../services/utils.service';
import { SeoService } from '../../../services/seo.service';
import { StorageService } from '../../../services/storage.service';



@Component({
  selector: 'app-products-inventory-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  public inventory_settings: ProductsInventoriesSettings = new ProductsInventoriesSettings();
  public user: SessionDataObject;

  public isUpdatingAutoGeneratingInventories = false;

  public months = environment.params.arrays.week.months;
  public weekly_days = environment.params.arrays.week.days;
  public selected_month_days_auto_gen_specific_date: any[] = [];
  public selected_month_days_auto_gen_yearly_time_period: any[] = [];
  public month_days: {
    label: string, value: string
  }[] = [
      { label: '01', value: '01' },
      { label: '02', value: '02' },
      { label: '03', value: '03' },
      { label: '04', value: '04' },
      { label: '05', value: '05' },
      { label: '06', value: '06' },
      { label: '07', value: '07' },
      { label: '08', value: '08' },
      { label: '09', value: '09' },
      { label: '10', value: '10' },
      { label: '11', value: '11' },
      { label: '12', value: '12' },
      { label: '13', value: '13' },
      { label: '14', value: '14' },
      { label: '15', value: '15' },
      { label: '16', value: '16' },
      { label: '17', value: '17' },
      { label: '18', value: '18' },
      { label: '19', value: '19' },
      { label: '20', value: '20' },
      { label: '21', value: '21' },
      { label: '22', value: '22' },
      { label: '23', value: '23' },
      { label: '24', value: '24' },
      { label: '25', value: '25' },
      { label: '26', value: '26' },
      { label: '27', value: '27' },
      { label: '28', value: '28' }
    ];

  public time_periods_automatically_generate_inventories: {
    label: string;
    value: string;
  }[] = [];


  constructor(
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storage: StorageService,
  ) { }

  async ngOnInit(): Promise<void> {

    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.SETTINGS.TAB_TITLE').toPromise() });

    this.user = this.storage.getItem('user');



    // specific time periods
    this.time_periods_automatically_generate_inventories = [
      { label: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.SETTINGS.TIME_PERIODS.YEARLY').toPromise(), value: 'yearly' },
      { label: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.SETTINGS.TIME_PERIODS.MONTHLY').toPromise(), value: 'monthly' },
      { label: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.SETTINGS.TIME_PERIODS.WEEKLY').toPromise(), value: 'weekly' },
      { label: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.SETTINGS.TIME_PERIODS.DAILY').toPromise(), value: 'daily' }
    ];




    // fetch here settings data
    try {

      const tmp_inventory_settings = await this.http.get<ProductsInventoriesSettings>(`${environment.params.host}/api/products/inventories/s/settings`).toPromise();
      if (tmp_inventory_settings)
        this.inventory_settings = tmp_inventory_settings;



      if (!environment.production)
        console.log(this.inventory_settings);


      this.autoGenerateSectionSpecificDateMonthChange();
      this.autoGenerateSectionSpecificTimePeriodYearlyMonthChange();
      this.autoGenerateSectionSpecificTimePeriodChange();

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }

  }




  // auto generate choosing specific date - month
  autoGenerateSectionSpecificDateMonthChange(): void {

    if (this.inventory_settings.auto_generation_timeline.setting_auto_generate_date__month !== null) {
      for (const month of this.months)
        if (month.numeric_value === this.inventory_settings.auto_generation_timeline.setting_auto_generate_date__month) {
          this.selected_month_days_auto_gen_specific_date = month.month_days;
          break;
        }
    } else {
      this.selected_month_days_auto_gen_specific_date = [];
      this.inventory_settings.auto_generation_timeline.setting_auto_generate_date__day = null;
    }

  }



  // auto generate choosing time period month
  autoGenerateSectionSpecificTimePeriodYearlyMonthChange(): void {

    if (this.inventory_settings.auto_generation_timeline.setting_auto_generate_date_frequency__month !== null) {

      for (const month of this.months)
        if (month.numeric_value === this.inventory_settings.auto_generation_timeline.setting_auto_generate_date_frequency__month) {
          this.selected_month_days_auto_gen_yearly_time_period = month.month_days;
          break;
        }

    } else {
      this.selected_month_days_auto_gen_yearly_time_period = [];
      this.inventory_settings.auto_generation_timeline.setting_auto_generate_date_frequency__day = null;
    }

  }



  // auto generate change time period
  autoGenerateSectionSpecificTimePeriodChange(): void {

    this.inventory_settings.auto_generation_timeline.setting_auto_generate_date_frequency__day = null;
    this.inventory_settings.auto_generation_timeline.setting_auto_generate_date_frequency__month = null;

  }



  // update setting --> auto generate inventories
  async updateSettingAutoGenerateInventories(): Promise<void> {

    this.isUpdatingAutoGeneratingInventories = true;


    try {

      this.inventory_settings.auto_generation_timeline.type = 'auto_generation_timeline';
      const response = await this.http.put<any>(`${environment.params.host}/api/products/inventories/settings/auto-generate-scheduling`, { setting_data: this.inventory_settings.auto_generation_timeline }).toPromise();


      this.inventory_settings.auto_generation_timeline = response.updated_object;



      this.utilsService.showToast({
        message: await this.translate.get('VIEWS.PRODUCTS_INVENTORIES.SETTINGS.ALERTS.SETTINGS_AUTO_INVENTORY_UPDATED').toPromise(),
        type: 'success'
      });

    } catch (error) {
      this.utilsService.standardErrorHandling(error);
    }



    this.isUpdatingAutoGeneratingInventories = false;

  }


}
