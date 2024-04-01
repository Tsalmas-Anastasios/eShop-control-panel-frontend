import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tel'
})
export class PhoneFormatPipe implements PipeTransform {

    transform(phone_number: any) {

        if (phone_number.toString().length === 8) {
            const countryCodeStr = phone_number.slice(0, 2);
            const areaCodeStr = phone_number.slice(2, 5);
            const midSectionStr = phone_number.slice(5, 8);
            const lastSectionStr = phone_number.slice(8);

            return `${countryCodeStr} (${areaCodeStr})${midSectionStr}-${lastSectionStr}`;
        } else if (phone_number.toString().length >= 10) {

            const countryCodeStr = phone_number.slice(0, 4);
            const first_part = phone_number.slice(4, 7);
            const second_part = phone_number.slice(7, 11);
            const last_part = phone_number.slice(11, 0);

            return `(${countryCodeStr}) ${first_part} ${second_part} ${last_part}`;

        }

    }

}
