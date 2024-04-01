import { StorageService } from '../../storage.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';




@Injectable({
    providedIn: 'root'
})
export class TfaGuard implements CanActivate {

    constructor(
        private router: Router,
        private storageService: StorageService,
        private http: HttpClient,
        private route: ActivatedRoute
    ) { }


    isAuthenticated(): boolean {


        try {

            const tfa_object = this.storageService.getItem('tfa');

            return tfa_object?.authentication_2fa__email || tfa_object?.authentication_2fa__app;

        } catch (error) {
            return false;
        }
    }


    canActivate(): boolean {

        if (this.isAuthenticated())
            return true;


        this.router.navigate(['/login']);

        return false;

    }

}
