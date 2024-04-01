import { Component, OnInit, Input, OnChanges, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import {
  DataTableCustomModuleOptions, DataTableCustomModuleHeaders, PagingConfig,
  StatusDropdownCustomModuleStatusItem, StatusDropdownCustomModuleOptions
} from '../../models';
import { UtilsService } from '../../services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-data-table-custom-module',
  templateUrl: './data-table-custom-module.component.html',
  styleUrls: ['./data-table-custom-module.component.scss']
})
export class DataTableCustomModuleComponent implements OnInit, OnChanges {

  @Input() columnHeaders: DataTableCustomModuleHeaders[];
  @Input() data: any;
  @Input() options: DataTableCustomModuleOptions;

  @Input() statuses: StatusDropdownCustomModuleStatusItem[];
  @Input() statuses_options: StatusDropdownCustomModuleOptions;


  @Output() endingPagesData: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() statusChange: EventEmitter<{ identifier: string, new_status: string }> = new EventEmitter<{ identifier: string, new_status: string }>();


  private endingPages = false;

  public public_data: any;
  public have_data: boolean;

  public identifier_header_column: string;

  public showEntriesList = [
    { label: '10', value: 10, selected: true },
    { label: '20', value: 20, selected: false },
    { label: '50', value: 50, selected: false },
    { label: '100', value: 100, selected: false },
    { label: '250', value: 250, selected: false },
    { label: '500', value: 500, selected: false }
  ];

  public showEntriesInputValue = 10;
  public pagePagination = 1;
  public pagesPaginationCollection: number[] = [];
  public startPagePagination: number;
  public endPagePagination: number;
  public pagesPagination: number;
  public paginationInitializeBlocker = false;
  public noDataFound = false;
  private searched_data: any = [];
  public sortedData = false;


  public searchFieldValue: string;

  public rows: string[] = [];
  public tableHTML: string = null;
  public column_count: number[] = [];

  public preLoader = true;


  public pagingConfig: PagingConfig = {} as PagingConfig;

  public current_routerLink: string;
  public current_queryParams: any;


  constructor(
    private utilsService: UtilsService,
    public translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  async ngOnInit(): Promise<void> {
  }



  async ngOnChanges(changes): Promise<void> {
    if (!environment.production)
      console.log(changes);

    this.preLoader = true;
    this.columnHeaders = changes?.columnHeaders?.currentValue ? changes.columnHeaders.currentValue : this.columnHeaders;
    this.data = changes?.data?.currentValue ? changes.data.currentValue : this.data;
    this.statuses = changes?.statuses?.currentValue ? changes.statuses.currentValue : this.statuses;
    this.statuses_options = changes?.statuses_options?.currentValue ? changes.statuses_options : this.statuses_options;





    if (this.data !== undefined && this.data.length > 0) {

      if (!environment.production)
        console.log(this.data);


      await this.initializeTable(this.data);

      if (this.pagePagination === this.pagesPagination - 1)
        await this.initializeTablePagination(this.sortedData, this.pagePagination);
      else {
        this.sortedData = false;
        this.showEntriesInputValue = 10;
        this.pagePagination = 1;
        await this.initializeTablePagination(false, null);
      }


      if (!environment.production)
        console.log(this.data);

      this.have_data = true;

    } else
      this.have_data = false;


    this.preLoader = false;


  }




  async sortingRecordsByField(index: number): Promise<void> {

    // sorting behavior: none --> asc --> desc --> none



    for (let i = 0; i < this.columnHeaders.length; i++)
      if (i !== index)
        this.columnHeaders[i]['sorting'] = 'none';

    if (this.columnHeaders[index]['sorting'] === 'none') {

      this.columnHeaders[index]['sorting'] = 'asc';
      this.public_data = [...new Set(this.data)];
      if (typeof this.public_data[0][this.columnHeaders[index]['field']] === 'string')
        this.public_data.sort((first, second) => first[this.columnHeaders[index]['field']].toString().localeCompare(second[this.columnHeaders[index]['field']].toString()));
      else if (typeof this.public_data[0][this.columnHeaders[index]['field']] === 'number')
        this.public_data.sort((first, second) => first[this.columnHeaders[index]['field']] - second[this.columnHeaders[index]['field']]);
      this.sortedData = true;

    } else if (this.columnHeaders[index]['sorting'] === 'asc') {

      this.columnHeaders[index]['sorting'] = 'desc';
      this.public_data = [...new Set(this.data)];
      if (typeof this.public_data[0][this.columnHeaders[index]['field']] === 'string')
        this.public_data.sort((first, second) => second[this.columnHeaders[index]['field']].toString().localeCompare(first[this.columnHeaders[index]['field']].toString()));
      else if (typeof this.public_data[0][this.columnHeaders[index]['field']] === 'number')
        this.public_data.sort((first, second) => second[this.columnHeaders[index]['field']] - first[this.columnHeaders[index]['field']]);
      this.sortedData = true;

    } else if (this.columnHeaders[index]['sorting'] === 'desc') {

      this.columnHeaders[index]['sorting'] = 'none';
      this.public_data = [...new Set(this.data)];
      this.sortedData = false;

    }






    await this.initializeTablePagination(this.sortedData, null);


  }





  initializeParametersForDataFunctions(): void {

    for (let i = 0; i < this.data.length; i++)
      for (const field in this.data[i])
        if (this.data[i][field]?.parameters)
          for (const parameter in this.data[i][field].parameters)
            this.data[i][field].parameters[parameter] = this.data[i][this.data[i][field].parameters[parameter]];

  }






  initializeLinkParametersForRouter(): void {

    for (let i = 0; i < this.data.length; i++)
      for (const field in this.data[i])
        if (this.data[i][field]?.linkParameters)
          for (const param in this.data[i][field]?.linkParameters)
            this.data[i][field].linkParameters[param] = this.data[i][this.data[i][field].linkParameters[param]];

    console.log(this.data);


    for (let i = 0; i < this.data.length; i++)
      for (const field in this.data[i])
        if (this.data[i][field]?.routerLink)
          if (this.data[i][field]?.linkParameters)
            for (const param in this.data[i][field].linkParameters)
              this.data[i][field].routerLink = this.data[i][field].routerLink.replace(`:${param}`, this.data[i][field].linkParameters[param]);

  }







  clearSortingFromTable(): void {
    for (let i = 0; i < this.columnHeaders.length; i++)
      this.columnHeaders[i]['sorting'] = 'none';

    this.sortedData = false;
  }




  async initializeTable(data?: any): Promise<void> {

    try {

      this.initializeLinkParametersForRouter();
      // analyze the current link
      this.getCurrentQueryParameters();


      // initialize query parameters if exist
      for (let i = 0; i < this.data.length; i++)
        for (const prop in this.data[i])
          if (this.data[i][prop]?.queryParams)
            for (const parameter in this.current_queryParams)
              if (!this.data[i][prop].queryParams.hasOwnProperty(parameter))
                this.data[i][prop].queryParams[parameter] = this.current_queryParams[parameter];



      // handle functions on the fields
      this.initializeParametersForDataFunctions();







      let auto_increment_fields = 0;
      let count_record_fields = Object.keys(data[0]).length;
      if (this.options.same_columns_as_headers) {

        for (let i = 1; i < data.length; i++)
          if (Object.keys(data[i]).length !== count_record_fields)
            throw new Error(await this.translate.get('MODULES.DATA_TABLE.RECORDS_COUNTING_NOT_MATCH').toPromise());

        for (let i = 0; i < this.columnHeaders.length; i++)
          if (this.columnHeaders[i]?.auto_increment)
            auto_increment_fields++;

        if (count_record_fields !== this.columnHeaders.length - auto_increment_fields)
          throw new Error(await this.translate.get('MODULES.DATA_TABLE.RECORDS_COUNTING_NOT_MATCH').toPromise());

      } else {


        // TODO: check the fields id they are exist

        // for (let i = 0; i < data.length; i++)
        //   for (let j = 0; j < this.columnHeaders.length; j++)
        //     if (!this.columnHeaders[j]?.auto_increment)
        //       if (!data[i][this.columnHeaders[j].field])
        //         throw new Error(await this.translate.get('MODULES.DATA_TABLE.RECORDS_COUNTING_NOT_MATCH').toPromise());






        const special_headers_characters = [' / ', '/ ', ' /', '/', ' - ', '- ', ' -', '-', ' | ', '| ', ' |', '|', ' \\ ', '\\ ', ' \\', '\\', ' , ', ', ', ' ,', ',', ' . ', '. ', ' .', '.', ' ', '  ', '   ', '    ', '     '];
        for (let i = 0; i < this.columnHeaders.length; i++) {
          let replaced = false;
          for (let j = 0; j < special_headers_characters.length; j++) {
            let splitted_header = null;
            if (this.columnHeaders[i]?.initial_field)
              splitted_header = this.columnHeaders[i].initial_field.split(special_headers_characters[j]);
            else
              splitted_header = this.columnHeaders[i].field.split(special_headers_characters[j]);

            if (splitted_header.length > 1) {
              if (!this.columnHeaders[i]?.initial_field)
                this.columnHeaders[i].initial_field = this.columnHeaders[i].field;

              this.columnHeaders[i].field = `custom_field_${i}`;


              for (let k = 0; k < data.length; k++) {
                let field_value = '';
                for (let field = 0; field < splitted_header.length; field++)
                  field_value += `${special_headers_characters[j]}${data[k][splitted_header[field]]}`;

                if (special_headers_characters[j].length === 1)
                  field_value = field_value.replace(/^.{1}/g, '');
                else if (special_headers_characters[j].length === 2)
                  field_value = field_value.replace(/^.{2}/g, '');
                else if (special_headers_characters[j].length === 3)
                  field_value = field_value.replace(/^.{3}/g, '');
                else if (special_headers_characters[j].length === 4)
                  field_value = field_value.replace(/^.{4}/g, '');
                else if (special_headers_characters[j].length === 5)
                  field_value = field_value.replace(/^.{5}/g, '');


                data[k][this.columnHeaders[i].field] = field_value;



                replaced = true;
              }
            }

            if (replaced)
              break;
          }
        }



        this.data = [];
        for (let i = 0; i < data.length; i++) {
          const record = {};
          for (let j = 0; j < this.columnHeaders.length; j++)
            if (!this.columnHeaders[j]?.auto_increment)
              if (data[i][this.columnHeaders[j].field]?.label)
                if (data[i][this.columnHeaders[j].field].label.toString().split(' ').length !== 2)
                  record[this.columnHeaders[j].field] = data[i][this.columnHeaders[j].field];
                else
                  if (data[i][this.columnHeaders[j].field].label.toString().split(' ')[0].toString() === 'field') {
                    record[data[i][this.columnHeaders[j].field].label.toString().split(' ')[1].toString()] = data[i][data[i][this.columnHeaders[j].field].label.toString().split(' ')[1].toString()];
                    record[this.columnHeaders[j].field] = data[i][this.columnHeaders[j].field];
                  } else
                    record[this.columnHeaders[j].field] = data[i][this.columnHeaders[j].field];
              else
                record[this.columnHeaders[j].field] = data[i][this.columnHeaders[j].field];


          if (this.options?.make_records_bold)
            record[this.options.make_records_bold__field] = data[i][this.options.make_records_bold__field];

          this.data.push(record);
        }


        if (!environment.production)
          console.log(this.columnHeaders);

        count_record_fields = this.columnHeaders.length;

      }


      // add sorting field to the headers - columns
      // sorting accepted values: 'none' | 'asc' | 'desc'
      for (let i = 0; i < this.columnHeaders.length; i++)
        this.columnHeaders[i]['sorting'] = 'none';


      for (let i = 0; i < this.columnHeaders.length; i++)
        if (this.columnHeaders[i]?.auto_increment)
          for (let j = 0; j < this.data.length; j++)
            if (!this.options?.make_records_bold)
              this.data[j][this.columnHeaders[i].field] = j + 1;
            else
              if (this.data[j][this.options.make_records_bold__field] === this.options.make_records_bold__field_value_equal)
                this.data[j][this.columnHeaders[i].field] = '<i class="fas fa-circle"></i>';
              else
                this.data[j][this.columnHeaders[i].field] = j + 1;




      this.column_count = [];
      for (let i = 0; i < count_record_fields + auto_increment_fields; i++)
        this.column_count.push(i);



      // initialize identifier header
      for (let i = 0; i < this.columnHeaders.length; i++)
        if (this.columnHeaders[i].identifier) {
          this.identifier_header_column = this.columnHeaders[i].field;
          break;
        }





      this.preLoader = false;



      if (!environment.production)
        console.log(this.data);

    } catch (error) {
      if (!environment.production) {
        console.log(error);
        this.utilsService.showToast({
          message: error.toString(),
          type: 'error',
        });
      }
    }


  }













  async initializeTablePagination(sorted: boolean, page?: number): Promise<void> {

    if (page === undefined || !page || page === null) {
      page = 1;

      if (page < 1 || page > this.pagesPagination)
        return;

    }

    this.pagePagination = page;


    if (this.searched_data.length === 0)
      this.pagesPagination = Math.ceil(this.data.length / this.showEntriesInputValue);
    else
      this.pagesPagination = Math.ceil(this.searched_data.length / this.showEntriesInputValue);


    let paging = null;
    if (this.pagesPagination <= 5)
      paging = {
        start_page: 1,
        end_page: this.pagesPagination
      };
    else
      if (this.pagePagination <= 3)
        paging = {
          start_page: 1,
          end_page: 5
        };
      else if (this.pagePagination + 2 >= this.pagesPagination)
        paging = {
          start_page: this.pagesPagination - 3,
          end_page: this.pagesPagination
        };
      else
        paging = {
          start_page: this.pagePagination - 2,
          end_page: this.pagePagination + 2
        };

    this.startPagePagination = Math.max((this.pagePagination - 1) * this.showEntriesInputValue, 0);
    this.endPagePagination = Math.min(Number(this.startPagePagination) + Number(this.showEntriesInputValue - 1), this.data.length - 1);



    if (sorted === true)
      this.public_data = this.public_data.slice(this.startPagePagination, this.endPagePagination + 1);
    else if (this.searched_data.length === 0)
      this.public_data = this.data.slice(this.startPagePagination, this.endPagePagination + 1);
    else
      this.public_data = this.searched_data.slice(this.startPagePagination, this.endPagePagination + 1);



    this.pagesPaginationCollection = [];
    for (let i = 0; i < this.pagesPagination; i++)
      this.pagesPaginationCollection.push(i + 1);



    if (this.pagesPagination > 1)
      if (this.pagePagination === this.pagesPagination - 1)
        this.informEndingPagesFromTable('ending');
      else
        this.informEndingPagesFromTable('not_ending');


    // await this.initializeTable(this.public_data);

  }






  searchRecord(): void {

    this.clearSortingFromTable();

    if (this.searchFieldValue !== '' && this.searchFieldValue !== null) {

      const filtered_data = [];
      for (let i = 0; i < this.data.length; i++)
        for (const prop in this.data[i])
          if (this.data[i][prop].toString().toUpperCase().search(this.searchFieldValue.toUpperCase()) > -1)
            filtered_data.push(this.data[i]);

      this.searched_data = [...new Set(filtered_data)];

      this.initializeTablePagination(false, null);

      if (this.searched_data.length === 0) {
        this.public_data = [];
        this.noDataFound = true;
      } else
        this.noDataFound = false;
    } else {
      this.searched_data = [];
      this.initializeTablePagination(false, null);
      this.noDataFound = false;
    }

  }



  informEndingPagesFromTable(status: 'ending' | 'not_ending'): void {
    if (status === 'ending')
      this.endingPages = true;
    else
      this.endingPages = false;

    this.endingPagesData.emit(this.endingPages);
  }






  getCurrentQueryParameters(): void {
    const current_fullLink = this.router.url.split('?');
    this.current_routerLink = current_fullLink[0];

    if (current_fullLink.length === 2) {
      const query_params = current_fullLink[1].split('&');
      this.current_queryParams = {};
      for (let i = 0; i < query_params.length; i++) {
        const parameter = query_params[i].split('=');
        this.current_queryParams[parameter[0]] = parameter[1];
      }
    } else
      this.current_queryParams = {};
  }








  onStatusChangeFromModuleStatusChangeDropdown(new_status: string, record_id: string): void {
    this.statusChange.emit({ identifier: record_id, new_status: new_status });
  }


}
