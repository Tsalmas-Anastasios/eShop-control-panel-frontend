import { StorageService } from '../../storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SessionDataObject } from '../../../models';




@Injectable({
    providedIn: 'root'
})
export class CompanyDataGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService,
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }


    isAuthenticated(): boolean {


        const user: SessionDataObject = this.storageService.getItem('user');

        const privileges: {
            company_data_edit: boolean;
            company_data_read: boolean;
        } = {
            company_data_edit: false,
            company_data_read: false,
        };


        if (user?.privileges)
            for (const privilege of user.privileges)
                for (const added_privilege in privileges)
                    if (privilege.privilege_type === added_privilege)
                        privileges[added_privilege] = privilege.value;


        return !(!user?.is_account && !privileges.company_data_read && !privileges.company_data_edit);

    }


    canActivate(): boolean {

        if (this.isAuthenticated())
            return true;


        this.router.navigate(['/settings']);

        return false;

    }

}
