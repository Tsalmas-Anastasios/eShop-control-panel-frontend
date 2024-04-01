import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Product, SessionDataObject } from '../../../models';

@Component({
  selector: 'app-products-inspiration-template1',
  templateUrl: './template1.component.html',
  styleUrls: ['./template1.component.scss']
})
export class Template1Component implements OnInit, OnChanges {

  @Input() product: Product;
  @Input() user: SessionDataObject;
  @Input() product_categories: string[][];

  // public product_categories: string[][];
  public main_image = '';



  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }


  ngOnChanges(changes): void {

    this.product = changes.currentValue ? changes.currentValue.product : this.product;
    this.product_categories = Object.entries(this.product.categories_belongs);


    for (const image of this.product.images)
      if (image.main_image) {
        this.main_image = image.url;
        break;
      }


  }

}
