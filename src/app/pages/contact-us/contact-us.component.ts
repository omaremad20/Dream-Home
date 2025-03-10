import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact-us',
  imports: [TranslatePipe ],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent  {
      currentLang: string = 'en';
      private translate = inject(TranslateService) ;
      private _PLATFORM_ID = inject (PLATFORM_ID) ;
      ngOnInit(): void {
        if(isPlatformBrowser(this._PLATFORM_ID)) {
          this.currentLang = sessionStorage.getItem('language') || 'en' ;
          this.translate.setDefaultLang(this.currentLang) ;
          this.translate.use(this.currentLang) ;
        }
      }
  }
