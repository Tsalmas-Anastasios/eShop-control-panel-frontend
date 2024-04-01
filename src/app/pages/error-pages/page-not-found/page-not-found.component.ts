import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    private seo: SeoService
  ) { }

  async ngOnInit(): Promise<void> {
    this.seo.updatePageMetadata({ title: await this.translate.get('VIEWS.PAGE_NOT_FOUND.TAB_TITLE').toPromise() });
  }

}
