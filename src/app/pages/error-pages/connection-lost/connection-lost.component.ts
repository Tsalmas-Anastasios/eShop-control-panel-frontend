import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../../services/seo.service';
import isOnline from 'is-online';

@Component({
  selector: 'app-connection-lost',
  templateUrl: './connection-lost.component.html',
  styleUrls: ['./connection-lost.component.scss']
})
export class ConnectionLostComponent implements OnInit {

  private returnUrl: string = null;
  private updater: any = null;

  constructor(
    public translate: TranslateService,
    private seo: SeoService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams.returnUrl || '/';




    this.updater = setInterval(async () => {
      const is_online = await isOnline();
      if (is_online) {
        clearInterval(this.updater);
        if (this.returnUrl !== '/')
          this.router.navigate([this.returnUrl]);
        else
          this.router.navigate(['/']);
      }
    }, 2000);



  }

}
