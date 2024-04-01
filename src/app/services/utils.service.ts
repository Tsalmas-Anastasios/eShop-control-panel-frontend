
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable, HostListener } from '@angular/core';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { CountryISO } from 'ngx-intl-tel-input';
import UAParser from 'ua-parser-js';
import { Subject, Observable, Subscription } from 'rxjs';
import FingerprintJS, { Agent as FingerprintAgent, GetResult as FingerprintResult } from '@fingerprintjs/fingerprintjs';


import { customAlphabet } from 'nanoid';
import * as lodash from 'lodash';
import * as moment from 'moment-timezone';
import * as qs from 'qs';
import * as XLSX from 'xlsx';
import * as tzlookup from 'tz-lookup';
import { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import Swal from 'sweetalert2/dist/sweetalert2.js';
// import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import htmlToPdfmake from 'html-to-pdfmake';
import domToImage from 'dom-to-image';
import * as html2pdf from 'html2pdf.js';


import { TranslateService } from '@ngx-translate/core';
import { NbGlobalLogicalPosition, NbToastrService } from '@nebular/theme';
import { StorageService } from './storage.service';
import { environment } from '../../environments/environment';
import { SessionDataObject, UserPrivilegesSettings } from '../models';

declare function loadingComponentServiceShow(zindex, id, flag);
declare function loadingComponentServiceHide(id);



@Injectable({ providedIn: 'root' })

export class UtilsService {


    public countries = environment.params.arrays.countries;



    public allowedCountriesForMobileNumbers: string[];

    private isMobileSubject = new Subject<any>();
    public isMobile: boolean = window.innerWidth <= 991.98;


    private chatStatusSubject = new Subject<boolean>();

    public browserTabID: string = null;

    public currentLanguage: 'en' | 'el' | 'it' | 'es' | 'ca' | 'de' | 'fr';
    public languageSubscription: Subscription;


    public lodash = lodash;
    public qs = qs;
    public moment = moment;
    public uaParser = new UAParser();
    public xlsx = XLSX;
    public swal = Swal;
    public dom_to_image = domToImage;
    public jsPdf = jsPDF;
    public html_to_canvas = html2canvas;
    public pdfMake = pdfMake;
    public pdfFonts = pdfFonts;
    public html2pdfmake = htmlToPdfmake;
    public html2pdf = html2pdf;


    constructor(
        private storageService: StorageService,
        public toast: ToastrService,
        private translate: TranslateService,
        private nbToastrService: NbToastrService,
    ) { }


    public componentLoaderShow(zindex, id, flag): void {
        loadingComponentServiceShow(zindex, id, flag);
    }
    public componentLoaderHide(id): void {
        loadingComponentServiceHide(id);
    }




    public delay(milliseconds: number) {
        return new Promise(resolve => setTimeout(resolve, milliseconds));
    }




    /** Return true if text is email address */
    public isEmail(text: string): boolean {

        const emailRegExp = new RegExp(/[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,50}$/gm);

        return emailRegExp.test(text);

    }



    public async showToast(params: { message: string, title?: string, type?: 'success' | 'warning' | 'error' | 'info', timeout?: number }): Promise<void> {

        const toastOptions: any = {
            closeButton: false,
            positionClass: 'toast-bottom-right'
        };

        if (params.timeout) {
            toastOptions.timeOut = params.timeout;
            toastOptions.disableTimeOut = false;
        }


        switch (params.type) {
            case 'success':
                this.toast.success(
                    params.message,
                    (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.SUCCESSFUL').toPromise(),
                    toastOptions);
                break;

            case 'warning':
                this.toast.warning(
                    params.message,
                    (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.ATTENTION_REQUIRED').toPromise(),
                    toastOptions);
                break;

            case 'error':
                this.toast.error(
                    params.message,
                    (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.ERROR').toPromise(),
                    toastOptions);
                break;

            case 'info':
                this.toast.info(
                    params.message,
                    (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise(),
                    toastOptions);
                break;

            default:
                this.toast.success(
                    params.message,
                    (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise(),
                    toastOptions);
                break;
        }

    }




    public async nbShowToast(params: { title?: string, message: string, type: 'basic' | 'primary' | 'success' | 'info' | 'warning' | 'danger' | 'control', timeout?: number }): Promise<void> {


        let title = null;

        switch (params.type) {
            case 'basic':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise();
                break;

            case 'primary':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise();
                break;

            case 'success':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.SUCCESSFUL').toPromise();
                break;

            case 'info':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.INFORMATION').toPromise();
                break;

            case 'warning':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.WARNING').toPromise();
                break;

            case 'danger':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.ERROR').toPromise();
                break;

            case 'control':
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise();
                break;

            default:
                title = (params.title) ? params.title : await this.translate.get('GENERIC.NOTIFICATIONS.NOTIFICATION_DEFAULT_TITLE').toPromise();
                break;

        }


        const status = params.type;
        const duration = (params.timeout) ? params.timeout : 3000;
        const destroyByClick = true;
        const position = NbGlobalLogicalPosition.BOTTOM_END;
        this.nbToastrService.show(
            title,
            params.message,
            {
                status,
                duration,
                destroyByClick,
                position
            }
        );


    }





    public refreshUserDataObject(user: any): void {
        this.storageService.removeItem('user');
        this.storageService.setItem('user', user);
    }













    public removeHTMLtagsFromString(string_expression: string): string {
        return string_expression.replace(new RegExp('\\<.*?\\>', 'g'), '');
    }





    public generateId(params: { length?: number, nanoid_alphabet?: string }): string {

        const alphabet = params?.nanoid_alphabet || environment.params.nanoid_alphabet_full;
        const length = params?.length || 12;

        return customAlphabet(alphabet, length)();

    }




    public getUsersPrivileges(): UserPrivilegesSettings {

        const user: SessionDataObject = this.storageService.getItem('user');


        let privileges: UserPrivilegesSettings;
        if (user?.privileges)
            privileges = new UserPrivilegesSettings().initializeUserPrivileges(user.privileges);
        else {
            privileges = new UserPrivilegesSettings();
            for (const privilege in privileges)
                privileges[privilege] = true;
        }


        return privileges;

    }





    public formatDateToLocaleDateString(date: string | Date): string | Date {
        return new Date(date);
    }






    public async standardErrorHandling(error: any): Promise<void> {

        if (!environment.production)
            console.log(error);

        this.showToast({
            title: await this.translate.get('GENERIC.ALERTS.ERROR_TITLE').toPromise(),
            message: await this.translate.get('GENERIC.ALERTS.SOMETHING_WENT_WRONG').toPromise(),
            type: 'error'
        });

    }





    public getCountryLabel(code: string): string {

        const country_object = this.lodash.find(this.countries, (obj) => obj.code === code);

        let name: string;
        if (country_object?.code)
            name = country_object.name;

        return name || code;

    }




}
