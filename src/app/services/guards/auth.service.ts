import { StorageService } from '../storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationExtras, CanDeactivate } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';




@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService,
        private http: HttpClient,
    ) { }


    async isAuthenticated(): Promise<boolean> {


        try {

            const user = this.storageService.getItem('user');

            const response = await this.http.get<any>(
                `${environment.params.host}/api/protected`
            ).toPromise();

            return Promise.resolve((user && user?.user_id && response?.message) ? true : false);

        } catch (error) {
            return Promise.resolve(false);
        }
    }


    async canActivate(): Promise<boolean> {

        if (await this.isAuthenticated())
            return Promise.resolve(true);

        const extras: NavigationExtras = {};
        if (!window.location.pathname.includes('/login'))
            extras.queryParams = {
                returnUrl: window.location.pathname
            };
        this.router.navigate(['/login'], extras);

        // if (!window.location.pathname.includes('/login'))
        //     window.location.reload();

        return Promise.resolve(false);

    }

}
