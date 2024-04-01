import { supported_coins } from './_arrays/_supported-coins';
import {
    all_order_statuses, order_statuses_order_confirmed, order_statuses_order_sent,
    order_statuses_order_completed
} from './_arrays/_order-statuses';
import {
    countries,
    countries_emergency_numbers,
    countries_driving_licenses,
    country_codes_eu,
} from './_arrays/_countries';
import { shop_types } from './_arrays/_shop-types';
import { HttpHeaders } from '@angular/common/http';

import { DataTablesDefaultSettings } from './_datatables';
import { Fonts } from './_fonts';
import { timeslots } from './_arrays/_timeslots';
import { products_statuses, products_statuses_dropdown_menu } from './_arrays/_product-statuses';
import { user_privileges } from './_arrays/_user-privileges';
import { warehouse_ownership_type } from './_arrays/_warehouse-ownership-type';
import { warehouse_power_type } from './_arrays/_warehouse-power-type';
import { energy_classes } from './_arrays/_energy-classes';
import { months } from './_arrays/_months';
import { weekly_days } from './_arrays/_days';
import { contact_types } from './_arrays/_contact-types';


export const environmentCommon = {
    production: false,
    environmentName: 'development',
    params: {
        host: 'https://localhost:8080',
        front_end_host: 'http://localhost:4200',
        local_host: {
            backend_local_host: 'https://localhost:8080',
        },
        appTitle: 'eCommerce Control Panel | Bizyhive',
        appVersion: '1.0.0',
        suid: 'bfa178cf-2724-4046-977d-8bb0ae8e18f5',
        emails: {
            support: 'someone@bizyhive.com'
        },
        maintenanceMode: false,
        httpOptions: {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            })
        },
        fonts: Fonts,
        receive_order_from_shop_db_record_id: 'tcr_WMmh_4Qojuuu6SKimnR7wKo5H3HS0oV1GU0k',
        arrays: {
            order_statuses: {
                all_formatted: all_order_statuses,
                confirmed_formatted: order_statuses_order_confirmed,
                sent_formatted: order_statuses_order_sent,
                completed_formatted: order_statuses_order_completed,
            },

            supported_coins: supported_coins,
            countries: countries,
            countries_emergency_numbers: countries_emergency_numbers,
            countries_driving_licenses: countries_driving_licenses,
            country_codes_eu: country_codes_eu,

            shop_types: shop_types,

            timeslots: timeslots,

            products: {
                statuses: products_statuses,
                formatted_statuses: products_statuses_dropdown_menu,
            },

            user_privileges: user_privileges,

            warehouses: {
                ownership_type: warehouse_ownership_type,
                power_type: warehouse_power_type,
                energy_classes: energy_classes,
            },

            week: {
                months: months,
                days: weekly_days,
            },

            contacts: {
                types: contact_types
            },
        },
        imagesMaxFileSize: 8 * 1024 * 1024, // 8 MB,
        nanoid_alphabet_full: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890)(_-',
        nanoid_alphabet_capital_letters: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
        nanoid_alphabet_mini_letters: 'abcdefghijklmnopqrstuvwxyz',
    },
    datatables: DataTablesDefaultSettings,
    custom_dtTables: {
        color: '#ccc',
        custom_table_classes: ['border-grey'],
        same_columns_as_headers: false,
    },
    status_dropdown_options: {
        dropdown_background_color: '#1E1E1E',
        dropdown_border_color: '#0E0B0B',
    }
};
