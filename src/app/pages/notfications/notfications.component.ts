import { reqHandler } from './../../../server';
  import { Component, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
  import { NotficationsService } from '../../core/services/notfications/notfications.service';
  import { ReviewsService } from '../../core/services/reviews/reviews.service';
  import { AuthService } from '../../core/services/Auth/auth.service';
  import { Subscription } from 'rxjs';
  import { FormsModule } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
  declare var bootstrap: any;
  @Component({
    selector: 'app-notfications',
    templateUrl: './notfications.component.html',
    styleUrl: './notfications.component.css',
    imports: [FormsModule , TranslatePipe],
  })
  export class NotficationsComponent implements OnInit, OnDestroy {
    NotficationsRes: any[] = [];
    callingAllNotfications: Subscription = new Subscription();
    userId!: string;
    employeeRatedId!:string ;
    isNotfaied: boolean = true;
    reviewId : string = '';
    selectedNotificationId: string = '';
    review : string = '';
    rating!: number ;
    subscription:Subscription | null = null;
    empNameHowSentReviewRequest!:string ;
    arr:number[] = [1 , 2 , 3 , 4 , 5] ;
    userRole!:string ;
    private reviewIdMap: { [notificationId: string]: string } = {};
  constructor(
      private _NotficationsService: NotficationsService,
      private _AuthService: AuthService,
      private _ReviewsService: ReviewsService
    ) {}
        currentLang: string = 'en';
        private translate = inject(TranslateService) ;
        private _PLATFORM_ID = inject (PLATFORM_ID) ;
    ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
              this.currentLang = sessionStorage.getItem('language') || 'en' ;
              this.translate.setDefaultLang(this.currentLang) ;
              this.translate.use(this.currentLang) ;
            }
      this.userId = this._AuthService.getUserId()!;
      this.userRole = this._AuthService.getRole() ! ;
        this.subscription = this._NotficationsService.getUserNotifications(this.userId).subscribe({
        next: (res) => {
          for(let i = 0 ; i < res ; i++) {
            return this.empNameHowSentReviewRequest = res[i].message.split(',').splice(2 , 3).join('') ;
          }
          this.NotficationsRes = res.notifications;
          console.log(this.NotficationsRes);
          this.NotficationsRes.forEach(notif => {
            if (notif.message.includes(',')) {
              const parts = notif.message.split(',');
              if (parts.length > 1) {
                const reviewId = parts[1].trim();
                this.reviewIdMap[notif._id] = reviewId;
              }
            }
          });
        },
        error: (err) => {
          this.isNotfaied = false;
          console.error('Error fetching notifications:', err);
        }
      }) ?? null;
      this.callingAllNotfications.add(this.subscription);
    }
    openReviewModal(notification: any) {
      const messageParts = notification.message.split(',');
      if (messageParts.length > 1) {
        this.reviewId  = messageParts[1].trim();
      } else {
        return;
      }
      this.selectedNotificationId = notification._id;
      this.review  = '';
      this.rating = 1;
      const modal = document.getElementById('reviewModal');
      if (modal) {
        const modalInstance = new (window as any).bootstrap.Modal(modal);
        modalInstance.show();
      }
    }
  submitReview() {
      if (!this.reviewId  || !this.review  || this.rating < 1 || this.rating > 5) {
        console.error('❌ Missing Data:', {
          ReviewId: this.reviewId ,
          review: this.review ,
          rating: this.rating
        });
        alert('❌ Please enter a valid review and rating (1-5)');
        return;
      }
      this._ReviewsService.updateAndSumbitReview(this.reviewId , this.review , this.rating).subscribe({
        next: (res) => {
          console.log('✅ Review Submitted Successfully!' , res);
          this.employeeRatedId = res.review.employee._id ;
          const messageToemp = `An Customer Accepted Your Review Request Successfully , ${res.review.rating} , ${res.review.review} , ${res.review.customer.name}` ;
          this._NotficationsService.addNotification(this.employeeRatedId , messageToemp).subscribe({
            next : (res) => {
              console.log(res);
            }
          })
          this.closeModal('reviewModal');
          this.deleteNotification(this.selectedNotificationId);
          this.showSuccessModal();
        },
        error: (err) => {
        }
      });
    }
    deleteNotification(notificationId: string): void {
      if (!notificationId) return;
      this._NotficationsService.deleteNotification(notificationId).subscribe({
        next: () => {
          this.NotficationsRes = this.NotficationsRes.filter(n => n._id !== notificationId);
        },
        error: (err) => {
          console.error('Failed to delete notification:', err);
        }
      });
    }
closeModal(modalId: string) {
  const modal = document.getElementById(modalId);
  if (modal) {
    const modalInstance = bootstrap.Modal.getInstance(modal);
    if (modalInstance) {
      modalInstance.hide();
    }
  }
}
showSuccessModal() {
  const successModal = document.getElementById('successModal');
  if (successModal) {
    const modalInstance = new bootstrap.Modal(successModal);
    modalInstance.show();
  }
}
    ngOnDestroy(): void {
      this.callingAllNotfications.unsubscribe();
      if(this.subscription) {
        this.subscription.unsubscribe() ;
        this.subscription = null ;
      }
    }
  }
