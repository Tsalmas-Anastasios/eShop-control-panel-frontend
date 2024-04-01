export class Country {
    name: string;
    code: string;
    vatPrefix: string;
}

export class CountryEmergencyNumber {
    id?: number;
    country_code: string;
    country_name: string;
    country_icon: string;
    emergency: string;
    police: string;
    ambulance: string;
    fire: string;
    group: string;
    calling_codes: string;

    constructor(props?: CountryEmergencyNumber) {
        this.id = props?.id || null;
        this.country_code = props?.country_code || null;
        this.country_name = props?.country_name || null;
        this.country_icon = props?.country_icon || null;
        this.emergency = props?.emergency || null;
        this.police = props?.police || null;
        this.ambulance = props?.ambulance || null;
        this.fire = props?.fire || null;
        this.group = props?.group || null;
        this.calling_codes = props?.calling_codes || null;
    }
}

