export const user_privileges: {
    label: string;
    value: string;
}[] = [

        { label: 'Account\'s connected users data access (Reading)', value: 'users_read' },
        { label: 'Account\'s connected users data access (Editing)', value: 'users_edit' },
        { label: 'Account\'s connected users data access (Add new user)', value: 'users_add_new' },

        { label: 'Integration catalog access (Read their list)', value: 'integrations_read' },
        { label: 'Integration modification', value: 'integrations_edit' },
        { label: 'New integration addition', value: 'integrations_new' },

        { label: 'Company data form viewing access', value: 'company_data_read' },
        { label: 'Company\'s information modify', value: 'company_data_edit' },

        { label: 'Order list viewing access', value: 'orders_read' },
        { label: 'Order editing possibility', value: 'orders_edit' },
        { label: 'Order addition possibility (use the csh registry)', value: 'orders_new' },

        { label: 'Product listing access', value: 'products_read' },
        { label: 'Product details editing', value: 'products_edit' },
        { label: 'Product addition possibility', value: 'products_new' },

        { label: 'Product categories listing access', value: 'product_categories_read' },
        { label: 'Product categories modifying', value: 'product_categories_edit' },
        { label: 'Addition of product categories', value: 'product_categories_new' },

    ];
