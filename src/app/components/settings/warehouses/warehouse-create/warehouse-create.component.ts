import { ChangeDetectionStrategy, Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { CompanyWarehouse, CompanyWarehouseColumn, CompanyWarehouseColumnShelf, CompanyWarehouseRunway } from '../../../../models';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../../environments/environment';
import { CountryISO, SearchCountryField } from 'ngx-intl-tel-input';
import { DatepickerOptions } from 'ng2-datepicker';
import { UtilsService } from '../../../../services/utils.service';


@Component({
  selector: 'app-settings-warehouse-create',
  templateUrl: './warehouse-create.component.html',
  styleUrls: ['./warehouse-create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class WarehouseCreateComponent implements OnInit {

  @Input() warehouse: CompanyWarehouse;
  @Output() updateWarehouseData: EventEmitter<CompanyWarehouse> = new EventEmitter<CompanyWarehouse>();

  public warehouse_runway: CompanyWarehouseRunway;
  public current_warehouse_runway: number;

  public warehouse_runway_mode: 'edit' | 'new';

  public contact_address_same_as_address = false;

  public ownership_type = environment.params.arrays.warehouses.ownership_type;
  public power_type = environment.params.arrays.warehouses.power_type;
  public energy_classes = environment.params.arrays.warehouses.energy_classes;
  public countries = environment.params.arrays.countries;

  public isSaving = false;

  private counter: {
    runways: number;
    columns: number;
    shelf: number;
  } = {
      runways: 0,
      columns: 0,
      shelf: 0,
    };


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
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
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



  newWarehouseRunway(
    type: 'runways' | 'columns' | 'shelf',
    params?: { index_runways?: number, index_columns?: number, index_shelf?: number }
  ): void {

    if (type === 'runways') {

      if (this.warehouse.runways.length > 0
        && ((this.warehouse.runways[this.warehouse.runways.length - 1].runway_code === null || this.warehouse.runways[this.warehouse.runways.length - 1].runway_code === ''
          || this.warehouse.runways[this.warehouse.runways.length - 1].runway_name === null || this.warehouse.runways[this.warehouse.runways.length - 1].runway_name === ''))) {

        this.current_warehouse_runway = this.warehouse.runways.length - 1;

        return;
      }

      this.warehouse.runways.push(new CompanyWarehouseRunway());
      this.warehouse.runways[this.warehouse.runways.length - 1].columns.push(new CompanyWarehouseColumn());
      this.warehouse.runways[this.warehouse.runways.length - 1].columns[0].shelf.push(new CompanyWarehouseColumnShelf());

      this.current_warehouse_runway = this.warehouse.runways.length - 1;

    } else if (type === 'columns') {

      this.warehouse.runways[params.index_runways].columns.push(new CompanyWarehouseColumn());
      this.warehouse.runways[params.index_runways].columns[this.warehouse.runways[params.index_runways].columns.length - 1].shelf.push(new CompanyWarehouseColumnShelf());

    } else if (type === 'shelf') {

      this.warehouse.runways[params.index_runways].columns[params.index_columns].shelf.push(new CompanyWarehouseColumnShelf());

    }

  }



  removeWarehouseRunway(
    type: 'runway' | 'column' | 'shelf',
    params: { index_runway?: number, index_column?: number, index_shelf?: number }
  ): void {

    if (type === 'runway') {
      this.warehouse.runways.splice(params.index_runway, 1);

      if (this.warehouse.runways.length <= 0)
        this.newWarehouseRunway('runways');
    } else if (type === 'column') {
      this.warehouse.runways[params.index_runway].columns.splice(params.index_column, 1);

      if (this.warehouse.runways[params.index_runway].columns.length <= 0)
        this.newWarehouseRunway('columns', { index_runways: params.index_runway });
    } else if (type === 'shelf') {
      this.warehouse.runways[params.index_runway].columns[params.index_column].shelf.splice(params.index_shelf, 1);

      if (this.warehouse.runways[params.index_runway].columns[params.index_column].shelf.length <= 0)
        this.newWarehouseRunway('shelf', { index_runways: params.index_runway, index_columns: params.index_column });
    }


    this.updateWarehouseData.emit(this.warehouse);

  }



  checkRequiredRunwayFields(): boolean {

    if (this.warehouse.runways[this.current_warehouse_runway].runway_name === ''
      || this.warehouse.runways[this.current_warehouse_runway].runway_name === null
      || this.warehouse.runways[this.current_warehouse_runway].runway_code === ''
      || this.warehouse.runways[this.current_warehouse_runway].runway_code === null
      || this.warehouse.runways[this.current_warehouse_runway].columns.length < 1)
      return false;



    for (const runway of this.warehouse.runways)
      for (const column of runway.columns) {

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



  closeWarehouseRunwayModalFun(): void {
    if (this.warehouse_runway_mode === 'new') {
      this.warehouse.runways[this.current_warehouse_runway].runway_code = null;
      this.warehouse.runways[this.current_warehouse_runway].runway_name = null;
      this.warehouse.runways[this.current_warehouse_runway].columns = [];
      this.newWarehouseRunway('columns', { index_runways: this.current_warehouse_runway });
    }

    this.current_warehouse_runway = -1;
  }


  saveWarehouseRunwayModalFun(): void {
    this.current_warehouse_runway = -1;
    this.updateWarehouseData.emit(this.warehouse);
  }



  editWarehouseRunway(index: number): void {
    this.current_warehouse_runway = index;
    this.warehouse_runway_mode = 'edit';
  }


  newWarehouseRunwayModeChanger(): void {
    this.warehouse_runway_mode = 'new';
  }

}
