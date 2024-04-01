import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { StatusDropdownCustomModuleStatusItem, StatusDropdownCustomModuleOptions } from '../../models';

@Component({
  selector: 'app-status-dropdown-custom-module',
  templateUrl: './status-dropdown-custom-module.component.html',
  styleUrls: ['./status-dropdown-custom-module.component.scss']
})
export class StatusDropdownCustomModuleComponent implements OnInit, OnChanges {

  @Input() current_status_value: string;
  @Input() statuses: StatusDropdownCustomModuleStatusItem[];
  @Input() options: StatusDropdownCustomModuleOptions;

  @Output() statusChange: EventEmitter<string> = new EventEmitter<string>();


  public activeStatus: StatusDropdownCustomModuleStatusItem;
  public statusIsChanging = false;


  constructor() { }

  ngOnInit(): void { }



  initializeActiveStatusLabel(): void {

    for (let i = 0; i < this.statuses.length; i++)
      if (this.statuses[i].value === this.current_status_value) {
        this.activeStatus = this.statuses[i];
        break;
      }


    if (this.activeStatus === undefined)
      this.activeStatus = {
        label: 'Null',
        value: 'null',
        letters_color: '#000',
        background_color: '#fff',
        order: 0
      };
  }



  async ngOnChanges(changes): Promise<void> {
    this.current_status_value = changes?.current_status_value ? changes?.current_status_value.currentValue : this.current_status_value;
    this.statuses = changes.currentValue ? changes.currentValue.statuses : this.statuses;
    this.options = changes.currentValue ? changes.currentValue.options : this.options;

    this.statusIsChanging = false;

    this.initializeActiveStatusLabel();
  }



  sortingStatuses(): void {
    this.statuses.sort((first, second) => first.order - second.order);
  }




  onStatusChange(new_status_value: string): void {

    this.statusIsChanging = true;

    this.statusChange.emit(new_status_value);

  }



}
