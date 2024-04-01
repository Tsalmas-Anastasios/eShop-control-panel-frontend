import { StorageService } from '../storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SessionDataObject } from '../../models';




@Injectable({
    providedIn: 'root'
})
export class OrdersGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService,
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }


    isAuthenticated(): boolean {


        const user: SessionDataObject = this.storageService.getItem('user');

        const privileges: {
            orders_edit: boolean;
            orders_read: boolean;
        } = {
            orders_edit: false,
            orders_read: false,
        };


        if (user?.privileges)
            for (const privilege of user.privileges)
                for (const added_privilege in privileges)
                    if (privilege.privilege_type === added_privilege)
                        privileges[added_privilege] = privilege.value;


        return !(!user?.is_account && !privileges.orders_read && !privileges.orders_edit);

    }


    canActivate(): boolean {

        if (this.isAuthenticated())
            return true;


        this.router.navigate(['/']);

        return false;

    }

}
