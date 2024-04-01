import { ChangeDetectionStrategy, Component, Input, OnInit, Output, EventEmitter, ViewChild, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import {
  CompanyWarehouse, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, CompanyWarehouseRunway
} from '../../../../models';
import { ControlContainer, NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../../../services/utils.service';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-settings-warehouse-details',
  templateUrl: './warehouse-details.component.html',
  styleUrls: ['./warehouse-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class WarehouseDetailsComponent implements OnInit, OnChanges {

  @Input() warehouse: CompanyWarehouse;
  @Input() mode: 'edit' | 'preview';

  @Output() updateWarehouseData: EventEmitter<CompanyWarehouse> = new EventEmitter<CompanyWarehouse>();
  @Output() updateWarehouseRunwayData: EventEmitter<CompanyWarehouseRunway> = new EventEmitter<CompanyWarehouseRunway>();
  @Output() addNewWarehouseRunwayData: EventEmitter<CompanyWarehouseRunway> = new EventEmitter<CompanyWarehouseRunway>();
  @Output() removeWarehouseRunwayData: EventEmitter<string> = new EventEmitter<string>();

  public ownership_type = environment.params.arrays.warehouses.ownership_type;
  public power_type = environment.params.arrays.warehouses.power_type;
  public energy_classes = environment.params.arrays.warehouses.energy_classes;
  public countries = environment.params.arrays.countries;

  public warehouse_runway: CompanyWarehouseRunway;
  public current_warehouse_runway = -1;
  public warehouse_runway_mode: 'preview' | 'edit' | 'new';

  public contact_address_same_as_address = false;




  // for telephone input
  SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  public preferredCountries: CountryISO[] = [];
  selectedCountryISO: CountryISO = null;
  public contact_telephone: any;
  public company_telephone: any;

  public warehouse_manager__phone: any;
  public warehouse_manager__phone2: any;






  constructor(
    public translate: TranslateService,
    public utilsService: UtilsService
  ) { }

  ngOnInit(): void {

    this.contact_telephone = this.warehouse.contact__phone;
    this.warehouse_manager__phone = this.warehouse.warehouse_manager__phone;
    this.warehouse_manager__phone2 = this.warehouse.warehouse_manager__phone2;

  }



  ngOnChanges(changes: SimpleChanges): void {
    this.warehouse.runways = changes?.warehouse?.currentValue ? changes.warehouse.currentValue.runways : this.warehouse.runways;
  }




  toggleSameContactAddressWithAddress(): void {
    this.contact_address_same_as_address = !this.contact_address_same_as_address;

    const address_fields = ['street', 'postal_code', 'country', 'city', 'state', 'latitude', 'longitude'];
    if (this.contact_address_same_as_address)
      for (const field of address_fields)
        this.parseAddressDataToContactData(field);

  }


  parseAddressDataToContactData(exception_field: string): void {
    if (this.contact_address_same_as_address)
      this.warehouse[`contact__${exception_field}`] = this.warehouse[`plot__${exception_field}`];

    this.onUpdateWarehouseData();
  }


  formatTelephone(final_object: any, final_object_field: string, telephone_var: any): void {
    this[final_object][final_object_field] = telephone_var?.internationalNumber || null;

    this.onUpdateWarehouseData();
  }


  onUpdateWarehouseData(): void {
    this.updateWarehouseData.emit(this.warehouse);
  }




  editWarehouseRunway(params: { mode: 'preview' | 'edit' | 'new', index?: number }): void {
    this.current_warehouse_runway = params.index;
    this.warehouse_runway_mode = params.mode;

    this.warehouse_runway = JSON.parse(JSON.stringify(this.warehouse.runways[params?.index || this.warehouse.runways.length - 1]));
    // to copy correctly the object

  }


  newWarehouseRunway(
    type: 'runways' | 'columns' | 'shelf',
    total_addition: boolean,
    params?: { index_runways?: number, index_columns?: number, index_shelf?: number },
  ): void {

    if (type === 'runways') {

      if (this.warehouse.runways.length > 0
        && ((this.warehouse.runways[this.warehouse.runways.length - 1].runway_code === null || this.warehouse.runways[this.warehouse.runways.length - 1].runway_code === ''
          || this.warehouse.runways[this.warehouse.runways.length - 1].runway_name === null || this.warehouse.runways[this.warehouse.runways.length - 1].runway_name === ''))) {

        this.current_warehouse_runway = this.warehouse.runways.length - 1;

        if (!total_addition)
          this.warehouse_runway = JSON.parse(JSON.stringify(this.warehouse.runways[this.current_warehouse_runway]));

        return;
      }

      this.warehouse.runways.push(new CompanyWarehouseRunway());
      this.warehouse.runways[this.warehouse.runways.length - 1].columns.push(new CompanyWarehouseColumn());
      this.warehouse.runways[this.warehouse.runways.length - 1].columns[0].shelf.push(new CompanyWarehouseColumnShelf());

      this.current_warehouse_runway = this.warehouse.runways.length - 1;

      if (!total_addition)
        this.warehouse_runway = JSON.parse(JSON.stringify(this.warehouse.runways[this.current_warehouse_runway]));

    } else if (type === 'columns') {

      if (total_addition) {
        this.warehouse.runways[params.index_runways].columns.push(new CompanyWarehouseColumn());
        this.warehouse.runways[params.index_runways].columns[this.warehouse.runways[params.index_runways].columns.length - 1].shelf.push(new CompanyWarehouseColumnShelf());
      } else {
        this.warehouse_runway.columns.push(new CompanyWarehouseColumn());
        this.warehouse_runway.columns[this.warehouse_runway.columns.length - 1].shelf.push(new CompanyWarehouseColumnShelf());
      }

    } else if (type === 'shelf') {

      if (total_addition)
        this.warehouse.runways[params.index_runways].columns[params.index_columns].shelf.push(new CompanyWarehouseColumnShelf());
      else
        this.warehouse_runway.columns[params.index_columns].shelf.push(new CompanyWarehouseColumnShelf());

    }

  }


  closeWarehouseRunwayModalFun(): void {
    if (this.warehouse_runway_mode === 'new') {
      this.warehouse.runways[this.current_warehouse_runway].runway_code = null;
      this.warehouse.runways[this.current_warehouse_runway].runway_name = null;
      this.warehouse.runways[this.current_warehouse_runway].columns = [];
      this.newWarehouseRunway('columns', true, { index_runways: this.current_warehouse_runway });
    }

    this.current_warehouse_runway = -1;
  }


  removeWarehouseRunway(
    type: 'runway' | 'column' | 'shelf',
    params: { index_runway?: number, index_column?: number, index_shelf?: number },
    total_remove: boolean,
  ): void {

    if (type === 'runway') {
      if (total_remove)
        this.removeWarehouseRunwayData.emit(this.warehouse.runways[params.index_runway]?.runway_id);
      else
        this.warehouse.runways.splice(params.index_runway, 1);

      if (this.warehouse.runways.length <= 0)
        this.newWarehouseRunway('runways', true);
    } else if (type === 'column') {
      if (total_remove) {
        this.warehouse.runways[params.index_runway].columns.splice(params.index_column, 1);

        if (this.warehouse.runways[params.index_runway].columns.length <= 0)
          this.newWarehouseRunway('columns', true, { index_runways: params.index_runway });
      } else {
        this.warehouse_runway.columns.splice(params.index_column, 1);

        if (this.warehouse_runway.columns.length <= 0)
          this.newWarehouseRunway('columns', false, { index_runways: params.index_runway });

      }
    } else if (type === 'shelf') {
      if (total_remove) {
        this.warehouse.runways[params.index_runway].columns[params.index_column].shelf.splice(params.index_shelf, 1);

        if (this.warehouse.runways[params.index_runway].columns[params.index_column].shelf.length <= 0)
          this.newWarehouseRunway('shelf', true, { index_runways: params.index_runway, index_columns: params.index_column });
      } else {
        this.warehouse_runway.columns[params.index_column].shelf.splice(params.index_shelf, 1);

        if (this.warehouse_runway.columns[params.index_column].shelf.length <= 0)
          this.newWarehouseRunway('shelf', false, { index_runways: params.index_runway, index_columns: params.index_column });
      }
    }


    this.updateWarehouseData.emit(this.warehouse);

  }


  checkRequiredRunwayFields(): boolean {

    if (this.warehouse_runway.runway_name === ''
      || this.warehouse_runway.runway_name === null
      || this.warehouse_runway.runway_code === ''
      || this.warehouse_runway.runway_code === null
      || this.warehouse_runway.columns.length < 1)
      return false;




    for (const column of this.warehouse_runway.columns) {

      if (column.column_code === '' || column.column_code === null
        || column.column_name === '' || column.column_name === null
        || column.shelf.length < 1)
        return false;


      for (const shelf of column.shelf)
        if (shelf.shelf_code === '' || shelf.shelf_code === null)
          return false;

    }



    return true;

  }



  updateRunway(): void {
    this.updateWarehouseRunwayData.emit(this.warehouse_runway);
  }


  saveNewRunway(): void {
    this.current_warehouse_runway = -1;
    this.addNewWarehouseRunwayData.emit(this.warehouse_runway);
  }


}
