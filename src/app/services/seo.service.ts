import { environment } from '../../environments/environment';
import { Meta, Title } from '@angular/platform-browser';
import { Injectable } from '@angular/core';



interface WebPageMetadata {
    title: string;
}



@Injectable({
    providedIn: 'root'
})
export class SeoService {

    constructor(
        // private pageService: PageService,
        private metaService: Meta,
        private titleService: Title,
    ) { }


    updatePageMetadata(data?: WebPageMetadata): void {
        if (data?.title)
            this.titleService.setTitle(`${data.title} - ${environment?.params?.appTitle || 'eCommerce Control Panel | Bizyhive'}`);
    }


}

