import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ProductCategory, ProductCategoryListItem, UserPrivilegesSettings } from '../../../../models';

@Component({
  selector: 'app-product-category-handle-form',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnChanges {

  @Input() product_category: ProductCategoryListItem | ProductCategory;
  @Input() mode: 'new' | 'edit';
  @Input() user_privileges: UserPrivilegesSettings;
  @Output() submitForm: EventEmitter<string> = new EventEmitter<string>();



  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }



  ngOnChanges(changes): void {
    this.user_privileges = changes?.currentValue ? changes.currentValue.user_privileges : this.user_privileges;
  }




  onSubmitForm(): void {
    this.submitForm.emit(this.product_category.label);
  }

}
