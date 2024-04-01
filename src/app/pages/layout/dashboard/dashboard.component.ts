import { UtilsService } from './../../../services/utils.service';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { UserPrivilegesSettings } from 'src/app/models';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public user_privileges: UserPrivilegesSettings;
  public show_search_area = false;

  constructor(
    private spinner: NgxSpinnerService,
    public translate: TranslateService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit(): void {
    this.user_privileges = this.utilsService.getUsersPrivileges();
  }


  hideSidebarLabelElements(tag: string): void {

    const labels: HTMLCollectionOf<Element> = document.getElementsByClassName('category-label');
    for (let i = 0; i < labels.length; i++) {
      if ((labels[i] as HTMLElement).style.display === 'block' || (labels[i] as HTMLElement).style.display === 'inline-block')
        (labels[i] as HTMLElement).style.display = 'none';
      else
        (labels[i] as HTMLElement).style.display = 'block';
    }


  }


}
