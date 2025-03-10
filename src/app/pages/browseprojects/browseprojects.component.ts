import { isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-browseprojects',
  imports: [TranslatePipe],
  templateUrl: './browseprojects.component.html',
  styleUrl: './browseprojects.component.css'
})
export class BrowseprojectsComponent {
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
