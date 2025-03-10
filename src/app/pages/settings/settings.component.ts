import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/services/Auth/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../core/services/UserProfile/user-profile.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-settings',
  imports: [FormsModule , TranslatePipe],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit , OnDestroy {
  theme: string = 'light';
  currentLang: string = 'en';
  private _AuthService = inject(AuthService) ;
  private _PLATFORM_ID = inject(PLATFORM_ID) ;
  private translate = inject(TranslateService) ;
  private _UserProfileService = inject(UserProfileService) ;
  userRole!:string ;
  userId!:string ;
  images!:any;
  callingUserProfile:Subscription | null = null;
  currentLangFrom:string = 'en';
  ngOnInit():void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLangFrom = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLangFrom) ;
      this.translate.use(this.currentLangFrom) ;
      }
    this.userRole = this._AuthService.getRole() !;
    this.userId = this._AuthService.getUserId() !;
    this.callingUserProfile = this._UserProfileService.getUserProfile(this.userId).subscribe({
      next : (res) => {
        this.images = res.user.images
      }
    }) ?? null ;
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          this.currentLangFrom = sessionStorage.getItem('language') !;
          this.theme = sessionStorage.getItem('theme') || 'light';
          document.documentElement.setAttribute('data-bs-theme', this.theme);
          this.currentLang = sessionStorage.getItem('language') || 'en';
          this.translate.setDefaultLang(this.currentLang);
          this.translate.use(this.currentLang);
        }
      }
      selectedTheme: string = this.theme;
      saveTheme() {
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          this.theme = this.selectedTheme;
          sessionStorage.setItem('theme', this.theme);
          document.documentElement.setAttribute('data-bs-theme', this.theme);
        }
      }
      selectedLang: string = this.currentLang;
      saveLanguage() {
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          this.currentLang = this.selectedLang;
          sessionStorage.setItem('language', this.currentLang);
          this.applyLanguageSettings(this.currentLang);
        }
      }
      private applyLanguageSettings(lang: string) {
        this.translate.use(lang);
        document.documentElement.lang = lang;
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      }
      setTheme(selectedTheme: string) {
        this.theme = selectedTheme;
      }
      confirmLogout() {
        if (isPlatformBrowser(this._PLATFORM_ID)) {
          sessionStorage.removeItem('userRole');
          sessionStorage.removeItem('userId');
          this._AuthService.logout();
          window.location.reload();
        }
      }
      ngOnDestroy(): void {
        if(this.callingUserProfile) {
          this.callingUserProfile.unsubscribe();
          this.callingUserProfile = null ;
        }
      }
}


