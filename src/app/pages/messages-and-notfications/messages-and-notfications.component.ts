import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../core/services/Auth/auth.service';
import { NotficationsService } from '../../core/services/notfications/notfications.service';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-messages-and-notfications',
  imports: [RouterLink , TranslatePipe],
  templateUrl: './messages-and-notfications.component.html',
  styleUrl: './messages-and-notfications.component.css'
})
export class MessagesAndNotficationsComponent implements OnInit , OnDestroy{
  userId!: string;
  userRole!: string;
  notificationCount: number = 0;
  callingNotfications!:Subscription ;
  private _AuthService = inject(AuthService);
  private _NotficationsService = inject(NotficationsService);
  private translate = inject(TranslateService) ;
  private _PLATFORM_ID = inject (PLATFORM_ID) ;
  currentLang: string = 'en';
  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLang) ;
      this.translate.use(this.currentLang) ;
    }
      this.userId = this._AuthService.getUserId()!;
      this.userRole = this._AuthService.getRole()!;
      this.getNotifications();
  }
  getNotifications() {
    this.callingNotfications = this._NotficationsService.getUserNotifications(this.userId).subscribe({
      next: (notifications) => {
        this.notificationCount = notifications.notifications.length;
      },
      error: (err) => {
        console.error('Failed to fetch notifications:', err);
      }
    });
  }
  ngOnDestroy(): void {
    this.callingNotfications.unsubscribe();
  }
}
