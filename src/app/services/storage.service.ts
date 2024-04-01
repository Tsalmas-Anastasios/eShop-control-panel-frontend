import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { Subject } from 'rxjs';
import * as SecureStorage from 'secure-web-storage';

@Injectable({ providedIn: 'root' })

export class StorageService {

    public cryptojs = CryptoJS;

    constructor() { }

    // share new data between components in the app
    public sessionData: any = new Subject();

    public storage = new SecureStorage(localStorage, {

        hash: function hash(key) {
            key = CryptoJS.SHA256(key, environment.params.suid);

            return key.toString();
        },


        // Encrypt the localstorage data
        encrypt: function encrypt(data) {
            try {
                return CryptoJS.AES.encrypt(JSON.stringify(data), environment.params.suid).toString();
            } catch (e) {
                // console.log(e);
                return data;
            }


        },

        // Decrypt the encrypted data
        decrypt: function decrypt(data) {

            try {
                const bytes = CryptoJS.AES.decrypt(data, environment.params.suid);
                if (bytes.toString())
                    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

                return data;

            } catch (e) {
                // console.log(e);
                return data;
            }

        }

    });



    // Set the json data to local storage
    public setItem(key: string, value: any): void {
        this.storage.setItem(key, value);
        return;
    }


    // Get the json value from local storage
    public getItem(key: string) {
        try {
            return this.storage.getItem(key);
        } catch (error) {
            return error.message;
        }
    }



    // Remove item from storage
    public removeItem(key: string): void {
        this.storage.removeItem(key);
    }


    // Clear the local storage
    public clearStorage() {
        return this.storage.clear();
    }


}
