import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { OrderTypeSearch, SessionDataObject } from '../../models';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-order-document-dispatch-form',
  templateUrl: './order-document-dispatch-form.component.html',
  styleUrls: ['./order-document-dispatch-form.component.scss']
})
export class OrderDocumentDispatchFormComponent implements OnInit {

  @Input() order: OrderTypeSearch;
  public date_issued = new Date();

  public user: SessionDataObject;

  constructor(
    public translate: TranslateService,
    private storageService: StorageService
  ) { }

  ngOnInit(): void {
    this.user = this.storageService.getItem('user');
  }

}
