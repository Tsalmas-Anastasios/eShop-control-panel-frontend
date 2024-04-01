import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-required-field',
  templateUrl: './required-field.component.html',
  styleUrls: ['./required-field.component.scss']
})
export class RequiredFieldComponent implements OnInit {

  @Input() type: 'asterisk_tooltip' | 'input_invalid';

  constructor(
    public translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }

}
