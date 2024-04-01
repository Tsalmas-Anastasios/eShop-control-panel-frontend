import { User } from './Auth';

export class UserPrivilege {

    rec_id: number;
    privilege_type: string;
    value: boolean;
    user_id: string;
    connected_account_id: string;

    constructor(props?: UserPrivilege) {

        this.rec_id = props?.rec_id || null;
        this.privilege_type = props?.privilege_type || null;
        this.value = props?.value ? true : false;
        this.user_id = props?.user_id || null;
        this.connected_account_id = props?.connected_account_id || null;

    }

}







export class UserPrivilegesSettings {

    users_read: boolean;
    users_edit: boolean;
    users_add_new: boolean;

    integrations_read: boolean;
    integrations_edit: boolean;
    integrations_new: boolean;

    company_data_read: boolean;
    company_data_edit: boolean;

    orders_read: boolean;
    orders_edit: boolean;
    orders_new: boolean;

    products_read: boolean;
    products_edit: boolean;
    products_new: boolean;

    product_categories_read: boolean;
    product_categories_edit: boolean;
    product_categories_new: boolean;

    warehouses_read: boolean;
    warehouses_edit: boolean;
    warehouses_new: boolean;

    contacts_read: boolean;
    contacts_edit: boolean;
    contacts_new: boolean;

    constructor(props?: UserPrivilegesSettings) {

        this.users_read = props?.users_read || false;
        this.users_edit = props?.users_edit || false;
        this.users_add_new = props?.users_add_new || false;

        this.integrations_read = props?.integrations_read || false;
        this.integrations_edit = props?.integrations_edit || false;
        this.integrations_new = props?.integrations_new || false;

        this.company_data_read = props?.company_data_read || false;
        this.company_data_edit = props?.company_data_edit || false;

        this.orders_read = props?.orders_read || false;
        this.orders_edit = props?.orders_edit || false;
        this.orders_new = props?.orders_new || false;

        this.products_read = props?.products_read || false;
        this.products_edit = props?.products_edit || false;
        this.products_new = props?.products_new || false;

        this.product_categories_read = props?.product_categories_read || false;
        this.product_categories_edit = props?.product_categories_edit || false;
        this.product_categories_new = props?.product_categories_new || false;

        this.warehouses_read = props?.warehouses_read || false;
        this.warehouses_edit = props?.warehouses_edit || false;
        this.warehouses_new = props?.warehouses_new || false;

        this.contacts_read = props?.contacts_read || false;
        this.contacts_edit = props?.contacts_edit || false;
        this.contacts_new = props?.contacts_new || false;

    }



    // public initializeUserPrivilegesArray(): UserPrivilege[] {

    //     const user_privileges_array: UserPrivilege[] = [];
    //     const user_privileges_settings: UserPrivilegesSettings = new UserPrivilegesSettings();


    // }


    public initializeUserPrivileges(user_privileges: UserPrivilege[]): UserPrivilegesSettings {

        const userPrivileges = new UserPrivilegesSettings();

        for (const privilege of user_privileges)
            userPrivileges[privilege.privilege_type] = privilege.value;



        return userPrivileges;

    }



    public initializeUserPrivilegesRecords(user_privileges: UserPrivilegesSettings, user: User): UserPrivilege[] {

        const records: UserPrivilege[] = [];


        for (const privilege in user_privileges)
            if (user?.privileges?.length === 0) {
                const new_privilege = new UserPrivilege();
                new_privilege.privilege_type = privilege;
                new_privilege.value = user_privileges[privilege];

                records.push(new_privilege);
            } else {

                let flag = false;

                for (const existing_privilege of user.privileges)
                    if (existing_privilege.privilege_type === privilege) {
                        existing_privilege.value = user_privileges[privilege];
                        flag = true;
                        break;
                    }


                if (!flag) {
                    const new_privilege = new UserPrivilege();
                    new_privilege.privilege_type = privilege;
                    new_privilege.value = user_privileges[privilege];

                    user.privileges.push(new_privilege);
                }

            }


        if (user?.privileges?.length === 0)
            return records;
        else
            return user.privileges;

    }

}
