export class ProductCategory {

    pcategory_id?: string;
    label?: string;
    connected_account_id: string;

    constructor(props?: ProductCategory) {

        this.pcategory_id = props?.pcategory_id || null;
        this.label = props?.label || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}






export class ProductCategoryListItem extends ProductCategory {

    label_action?: any;
    quick_action__edit?: any;
    quick_action__delete?: any;

    constructor(props?: ProductCategoryListItem) {

        super(props);
        this.label_action = props?.label_action || null;
        this.quick_action__edit = props?.quick_action__edit || null;
        this.quick_action__delete = props?.quick_action__delete || null;

    }

}
