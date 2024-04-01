import { StorageService } from '../../storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SessionDataObject } from '../../../models';




@Injectable({
    providedIn: 'root'
})
export class ConnectedUsersDetailsGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService,
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }


    isAuthenticated(): boolean {


        const user: SessionDataObject = this.storageService.getItem('user');

        const privileges: {
            users_read: boolean;
            users_edit: boolean;
            users_add_new: boolean;
        } = {
            users_read: false,
            users_edit: false,
            users_add_new: false,
        };


        if (user?.privileges)
            for (const privilege of user.privileges)
                for (const added_privilege in privileges)
                    if (privilege.privilege_type === added_privilege)
                        privileges[added_privilege] = privilege.value;


        return !(!user?.is_account && !privileges.users_read && !privileges.users_edit);

    }


    canActivate(): boolean {

        if (this.isAuthenticated())
            return true;


        this.router.navigate(['/settings']);

        return false;

    }

}
