import { User1, Message } from './../../core/interfaces/chats';
import { AuthService } from './../../core/services/Auth/auth.service';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ChatService } from '../../core/services/chat/chat.service';
import { Chat } from '../../core/interfaces/chats';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReviewsService } from '../../core/services/reviews/reviews.service';
import { NotficationsService } from '../../core/services/notfications/notfications.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  imports: [RouterLink , TranslatePipe]
})
export class MessagesComponent implements OnInit, OnDestroy {
  userId!: string;
  AllChats: Chat[] = [];
  showNoChatsDiv = false;
  callingApi: Subscription | null = null;
  userRole!: string;
  isLoading = true;
  userDead!:string ;
  userTarget!:string ;
  customers:string[] = []
  customersNO:string[] = []
  hasPreviousRequest = false;
  empId!:string ;
  currentLang: string = 'en';
  private _ChatService = inject(ChatService);
  private _AuthService = inject(AuthService);
  private _ReviewsService = inject(ReviewsService);
  private __NotficationsService = inject(NotficationsService);
  private readonly _ActivatedRoute = inject (ActivatedRoute)
  private router = inject(Router) ;
  private translate = inject(TranslateService) ;
  private _PLATFORM_ID = inject (PLATFORM_ID) ;
  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLang) ;
      this.translate.use(this.currentLang) ;
    }
    this._ActivatedRoute.paramMap.subscribe( {
      next : (param) => {
        this.empId = param.get('jobId') ! ;
      }
    })
    this.userId = this._AuthService.getUserId()!;
    this.userRole = this._AuthService.getRole()!;
    this.callingApi = this._ChatService.getAllChats(this.userId).subscribe({
      next: (res) => {
        for(let i = 0 ; i < res.chats.length ; i++) {
          this.userDead = res.chats[i].user1._id ;
        }
        this.AllChats = res.chats;
        this.isLoading = false;
        if (this.AllChats.length === 0) {
          this.showNoChatsDiv = true;
        } else {
        }
      },
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.message === 'No chats found for this user') {
          this.showNoChatsDiv = true;
        }
      }
    });
    this._ReviewsService.getAllReviewsForUser(this.userId).subscribe({
      next : (res) => {
        for(let i = 0 ; i < res.length ; i++ ) {
          this.userTarget = res[i].customerId;
          this.customersNO.push(this.userTarget) ;
        }
      }
    })
  }
  hasPreviousSent:boolean =true ;
  empName!:string ;
  reviewId!:string ;
  custName!:string ;
  sendReviewRequest(customerId: string) {
    const senderId = this.userId;
    this._ReviewsService.sendRequestReview(senderId, customerId).subscribe({
      next: (response) => {
        this.reviewId = response?.review?._id;
        this.custName = response.review.customer.name ;
        this.empName = response.review.employee.name ;
        const messageForEmp = `You Have Sent A Review Request To Customer , ${this.reviewId} , ${this.custName}`
        this.__NotficationsService.addNotification(this.userId , messageForEmp).subscribe({
          next : (res) => {
          }
        })
        const message = `An Employee Requested Your Review , ${this.reviewId} , ${this.empName}`;
        this.__NotficationsService.addNotification(customerId, message).subscribe({
          next: (res) => {
          },
          error: (err) => {
          }
        });
        setTimeout(() => {
          const successModal = document.getElementById('successModal');
          if (successModal) {
            const modalInstance = new (window as any).bootstrap.Modal(successModal);
            modalInstance.show();
          }
        }, 300);
        setTimeout(() => {
          window.location.reload();
        }, 1800);
      },
      error: (err) => {
      }
    });
  }
  openEmployeeProfile(userId: string) {
    this.router.navigate(['/employee-profile', userId]);
  }
  ngOnDestroy(): void {
    if (this.callingApi) {
      this.callingApi.unsubscribe();
      this.callingApi = null;
    }
  }
}
