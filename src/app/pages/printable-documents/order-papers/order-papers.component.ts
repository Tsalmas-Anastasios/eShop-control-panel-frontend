import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrintService } from '../../../services/print.service';
import { OrderTypeSearch } from '../../../models';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '../../../services/utils.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-order-papers',
  templateUrl: './order-papers.component.html',
  styleUrls: ['./order-papers.component.scss']
})
export class OrderPapersComponent implements OnInit {

  private order_id: string = null;
  public documents: string[] = [];
  public order: OrderTypeSearch;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    public translate: TranslateService,
    private spinner: NgxSpinnerService,
    private printService: PrintService,
    private utilsService: UtilsService,
  ) {

    const params = JSON.parse(this.route.snapshot.params['order_orderPapers']);
    this.order_id = params?.order_id || null;
    this.documents = params?.documents || ['invoice_receipt'];

  }




  async ngOnInit(): Promise<void> {

    try {

      this.order = await this.http.get<OrderTypeSearch>(`${environment.params.host}/api/ecommerce/store/orders/${this.order_id}`).toPromise();



      if (!environment.production)
        console.log(this.order);

    } catch (error) {
      this.spinner.hide();

      await this.utilsService.standardErrorHandling(error);
    }

    this.printService.onDataReady();

  }

}
