import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { UserProfileService } from '../../core/services/UserProfile/user-profile.service';
import { UserProfile } from '../../core/interfaces/userprofile';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-my-profile',
  imports: [RouterLink , TranslatePipe],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit , OnDestroy {
  userProfile!: UserProfile;
  userName!:string ;
  isLoading = true;
  userRole!:string ;
  callingApi:Subscription | null = null ;
  constructor(private userProfileService: UserProfileService) {}
  currentLang: string = 'en';
  private translate = inject(TranslateService) ;
  private _PLATFORM_ID = inject (PLATFORM_ID) ;
  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLang) ;
      this.translate.use(this.currentLang) ;
    }
    const userId = sessionStorage.getItem('userId');
    if (userId) {
      this.callingApi = this.userProfileService.getUserProfile(userId).subscribe({
        next: (response) => {
          this.userProfile = response.user;
          this.userRole = response.user.role ;
          this.userName = response.user.firstName ;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('API Error:', error);
          this.isLoading = false;
        }

      }) ?? null;
    }
  }
  ngOnDestroy(): void {
    if(this.callingApi) {
      this.callingApi.unsubscribe() ;
      this.callingApi = null
    }
  }
}
