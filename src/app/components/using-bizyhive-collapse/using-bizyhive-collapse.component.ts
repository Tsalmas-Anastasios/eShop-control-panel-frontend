import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-using-bizyhive-cloud-collapse',
  templateUrl: './using-bizyhive-collapse.component.html',
  styleUrls: ['./using-bizyhive-collapse.component.scss']
})
export class UsingBizyhiveCollapseComponent implements OnInit {

  @Input() using_bizyhive_cloud: boolean;

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
  }

}
