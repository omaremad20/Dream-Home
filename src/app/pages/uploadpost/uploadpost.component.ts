import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-uploadpost',
  imports: [TranslatePipe],
  templateUrl: './uploadpost.component.html',
  styleUrl: './uploadpost.component.css'
})
export class UploadpostComponent {
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
