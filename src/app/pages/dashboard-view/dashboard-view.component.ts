import { StorageService } from './../../services/storage.service';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { SeoService } from '../../services/seo.service';
import { TranslateService } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {
  NgxChartsData, DashboardStats, Product, ProductWithCategoryLabel, SessionDataObject, UserPrivilegesSettings
} from '../../models';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { UtilsService } from '../../services/utils.service';
import { environment } from '../../../environments/environment';
import { NbAlertComponent } from '@nebular/theme';




@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard-view.component.html',
  styleUrls: ['./dashboard-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardViewComponent implements OnInit {

  public page_loaded = false;

  public isOnProduction = environment.production;

  public chart_data: NgxChartsData;
  public chart_data_SALES: NgxChartsData;

  public orders_stats_graph = [];
  public data_SALES_graph = [];

  public customOptions: OwlOptions = {
    items: 4,
    // nav: true,
    // // tslint:disable-next-line:quotemark
    // navText: [
    //   '<i class="fas fa-arrow-circle-left"></i>',
    //   '<i class="fas fa-arrow-circle-right"></i>'
    // ],
    dots: true,
    loop: false,
    pullDrag: false,
    dragEndSpeed: 0,
    mouseDrag: true,
    touchDrag: true,
    autoWidth: true,
    margin: 0,
    startPosition: 0,
    stagePadding: 0,
    responsive: {
      0: {
        items: 2,
        dots: true
      },
      600: {
        items: 3,
        dots: true
      },
      768: { items: 3 },
      991: { items: 2 },
      1000: {
        items: 3
      },
      1200: {
        items: 4
      }
    }
  };

  public dateRangePicker_options: any = null;

  public stats: any;
  public products: Product[] = [];
  public products_per_category: any[] = [];

  public user: SessionDataObject;

  public alerts: {
    company_data: boolean
  } = {
      company_data: true,
    };


  public loaders: {
    famous_products_col: boolean;
    famous_products_carousel: boolean;
  } = {
      famous_products_col: true,
      famous_products_carousel: true,
    };



  public user_privileges: UserPrivilegesSettings;



  constructor(
    public translate: TranslateService,
    private http: HttpClient,
    private cdRef: ChangeDetectorRef,
    private spinner: NgxSpinnerService,
    private router: Router,
    private utilsService: UtilsService,
    private seo: SeoService,
    private storageService: StorageService,
  ) {

  }

  async ngOnInit(): Promise<void> {

    this.spinner.show();

    this.user_privileges = this.utilsService.getUsersPrivileges();

    this.user = this.storageService.getItem('user');
    if (this.user?.company_data)
      this.alerts.company_data = false;




    // charts
    this.chart_data = {
      view: undefined,

      showXAxis: true,
      showYAxis: true,
      gradient: false,
      showLegend: true,
      legendTitle: 'Orders',
      showXAxisLabel: true,
      xAxisLabel: await this.translate.get('GENERIC.LABELS.MONTHS').toPromise(),
      showYAxisLabel: true,
      yAxisLabel: await this.translate.get('VIEWS.HOME.ORDERS').toPromise(),

      scheme: {
        domain: ['#506FDE', '#229D18', '#FB1818', '#000']
      },

      autoScale: true
    };



    this.chart_data_SALES = {
      view: undefined,

      showXAxis: true,
      showYAxis: true,
      gradient: false,
      showLegend: false,
      showXAxisLabel: true,
      xAxisLabel: await this.translate.get('GENERIC.LABELS.MONTHS').toPromise(),
      showYAxisLabel: true,
      yAxisLabel: await this.translate.get('GENERIC.LABELS.SALES').toPromise(),

      scheme: {
        domain: ['#FB1818']
      },

      autoScale: true
    };


    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.HOME.TAB_TITLE').toPromise() });





    // fetch statistics
    try {

      this.stats = await this.http.get<any>(`${environment.params.host}/api/dashboard/stats/all`).toPromise();


      if (!environment.production)
        console.log(this.stats);

    } catch (error) {

      this.spinner.hide();

      this.utilsService.standardErrorHandling(error);

    }


    await this.initializeCharts();
    await this.initializeDateRangeOptions();





    this.page_loaded = true;

    this.spinner.hide();



    this.cdRef.detectChanges();


    // famous products
    try {

      [this.products, this.products_per_category] = await Promise.all([
        this.http.get<Product[]>(`${environment.params.host}/api/ecommerce/store/products/famous/list`).toPromise(),
        this.http.get<any[]>(`${environment.params.host}/api/ecommerce/store/products/famous/list-category`).toPromise(),
      ]);

    } catch (error) {

      this.utilsService.standardErrorHandling(error);

    }


    this.loaders.famous_products_carousel = false;
    this.loaders.famous_products_col = false;


    this.cdRef.detectChanges();

  }




  carouselDateRangePickerTopProducts(value: any, datepicker?: any) { }





  async initializeCharts(): Promise<void> {

    this.orders_stats_graph = [
      {
        name: await this.translate.get('VIEWS.HOME.TOTAL_ORDERS').toPromise(),
        series: [
          {
            name: await this.translate.get('GENERIC.LABELS.JANUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.january?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.FEBRUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.february?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MARCH').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.march?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.APRIL').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.april?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MAY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.may?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JUNE').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.june?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JULY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.july?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.AUGUST').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.august?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.SEPTEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.september?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.OCTOBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.october?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.NOVEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.november?.total_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.DECEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.december?.total_orders || 0
          }
        ]
      },
      {
        name: await this.translate.get('VIEWS.HOME.COMPLETED_ORDERS').toPromise(),
        series: [
          {
            name: await this.translate.get('GENERIC.LABELS.JANUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.january?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.FEBRUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.february?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MARCH').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.march?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.APRIL').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.april?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MAY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.may?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JUNE').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.june?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JULY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.july?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.AUGUST').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.august?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.SEPTEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.september?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.OCTOBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.october?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.NOVEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.november?.completed_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.DECEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.december?.completed_orders || 0
          }
        ]
      },
      {
        name: await this.translate.get('VIEWS.HOME.CANCELLED_ORDERS').toPromise(),
        series: [
          {
            name: await this.translate.get('GENERIC.LABELS.JANUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.january?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.FEBRUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.february?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MARCH').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.march?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.APRIL').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.april?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MAY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.may?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JUNE').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.june?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JULY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.july?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.AUGUST').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.august?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.SEPTEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.september?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.OCTOBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.october?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.NOVEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.november?.archived_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.DECEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.december?.archived_orders || 0
          }
        ]
      },
      {
        name: await this.translate.get('VIEWS.HOME.RETURNED_ORDERS').toPromise(),
        series: [
          {
            name: await this.translate.get('GENERIC.LABELS.JANUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.january?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.FEBRUARY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.february?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MARCH').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.march?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.APRIL').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.april?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MAY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.may?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JUNE').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.june?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JULY').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.july?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.AUGUST').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.august?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.SEPTEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.september?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.OCTOBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.october?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.NOVEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.november?.returned_orders || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.DECEMBER').toPromise(),
            value: this.stats?.stats?.orders?.analytics?.per_month?.december?.returned_orders || 0
          }
        ]
      }
    ];


    this.data_SALES_graph = [
      {
        name: await this.translate.get('VIEWS.HOME.MONTHLY_SALES').toPromise(),
        series: [
          {
            name: await this.translate.get('GENERIC.LABELS.JANUARY').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.january || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.FEBRUARY').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.february || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MARCH').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.march || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.APRIL').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.april || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.MAY').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.may || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JUNE').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.june || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.JULY').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.july || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.AUGUST').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.august || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.SEPTEMBER').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.september || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.OCTOBER').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.october || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.NOVEMBER').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.november || 0
          },
          {
            name: await this.translate.get('GENERIC.LABELS.DECEMBER').toPromise(),
            value: this.stats?.stats?.incomes?.month_analysis?.december || 0
          }
        ]
      }
    ];

  }


  async initializeDateRangeOptions(): Promise<void> {

    this.dateRangePicker_options = {
      locale: {
        format: 'MM-DD-YYYY',
        separator: ' - ',
        applyLabel: await this.translate.get('GENERIC.ACTIONS.APPLY').toPromise(),
        cancelButton: await this.translate.get('GENERIC.ACTIONS.CANCEL').toPromise(),
        daysOfWeek: [
          await this.translate.get('GENERIC.LABELS.MONDAY_SMALL').toPromise(),
          await this.translate.get('GENERIC.LABELS.TUESDAY_SMALL').toPromise(),
          await this.translate.get('GENERIC.LABELS.WEDNESDAY_SMALL').toPromise(),
          await this.translate.get('GENERIC.LABELS.THURSDAY_SMALL').toPromise(),
          await this.translate.get('GENERIC.LABELS.FRIDAY_SMALL').toPromise(),
          await this.translate.get('GENERIC.LABELS.SATURDAY_SMALL').toPromise(),
          await this.translate.get('GENERIC.LABELS.SUNDAY_SMALL').toPromise()
        ],
        monthNames: [
          await this.translate.get('GENERIC.LABELS.JANUARY').toPromise(),
          await this.translate.get('GENERIC.LABELS.FEBRUARY').toPromise(),
          await this.translate.get('GENERIC.LABELS.MARCH').toPromise(),
          await this.translate.get('GENERIC.LABELS.APRIL').toPromise(),
          await this.translate.get('GENERIC.LABELS.MAY').toPromise(),
          await this.translate.get('GENERIC.LABELS.JUNE').toPromise(),
          await this.translate.get('GENERIC.LABELS.JULY').toPromise(),
          await this.translate.get('GENERIC.LABELS.AUGUST').toPromise(),
          await this.translate.get('GENERIC.LABELS.SEPTEMBER').toPromise(),
          await this.translate.get('GENERIC.LABELS.OCTOBER').toPromise(),
          await this.translate.get('GENERIC.LABELS.NOVEMBER').toPromise(),
          await this.translate.get('GENERIC.LABELS.DECEMBER').toPromise()
        ],
        firstDay: 1,
      },
      alwaysShowCalendars: false,
      autoApply: true,
      drops: 'auto',
      opens: 'right',
      startDate: this.utilsService.moment().startOf('month').toDate(),
      endDate: this.utilsService.moment().endOf('month').toDate(),
    };

  }




  redirectToLink(link: string): void {
    this.router.navigate([link]);
  }


  alertOnClose(alert: 'company_data'): void {
    this.alerts[alert] = false;
  }
}
