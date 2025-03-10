import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-footer',
  imports: [TranslatePipe],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit  {
  callingLanguage!:Subscription ;
  constructor(
    private _TranslateService: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.updateDirection();
      this._TranslateService.onLangChange.subscribe(() => {
        this.updateDirection();
      });
    }
  }

  updateDirection(): void {
    if (isPlatformBrowser(this.platformId)) {
      const currentLang = this._TranslateService.currentLang || 'en';
      document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }

}

