import { UserProfileService } from './../../core/services/UserProfile/user-profile.service';
import { AuthService } from './../../core/services/Auth/auth.service';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ChatService } from '../../core/services/chat/chat.service';
import { FormsModule } from '@angular/forms'
import { Subscription } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] ,
  imports : [FormsModule , RouterLink , TranslatePipe]
})
export class ChatComponent implements OnInit , OnDestroy {
  senderId!: string;
  receiverId!: string;
  messageText: string = '';
  isLoading:boolean = true ;
  msgTime!:string ;
  userRole!:string ;
  workerName!:string ;
  messages: any[] = [];
  timeStamp:string[] = [] ;
  currentLang:string = 'en'
  calling:Subscription | null = null;;
  constructor(
    private chatService: ChatService,
    private route: ActivatedRoute,
    private authService: AuthService ,
    private _UserProfileService:UserProfileService ,
  ) {}
  private translate = inject(TranslateService) ;
  private _PLATFORM_ID = inject (PLATFORM_ID) ;
  ngOnInit() {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLang) ;
      this.translate.use(this.currentLang) ; }
    this.senderId = this.authService.getUserId() !;
    this.userRole = this.authService.getRole() ! ;
      this.route.paramMap.subscribe(params => {
        this.receiverId = params.get('receiverId') !;
      })
      this.calling = this.chatService.getChat(this.senderId , this.receiverId).subscribe({
        next: (res) => {
          this.messages = res.messages;
          this.msgTime = res.messages.timestamp ;
          this.isLoading = false ;
        } ,
        error: (err) => {
          this.isLoading = false
        }
      }) ?? null
          this._UserProfileService.getUserProfile(this.receiverId).subscribe( {
            next : (res) => {
              this.workerName = res.user.firstName ;
              console.log(this.workerName);
            }
          } )
    }
    sendMessage(): void {
      if (this.messageText.trim() && this.senderId && this.receiverId) {
        const newMessage = { senderId: this.senderId, receiverId: this.receiverId, message: this.messageText };
        this.chatService.sendMessage(this.senderId, this.receiverId, this.messageText).subscribe(() => {
          this.messages.push(newMessage);
          this.messageText = '';
        });
      }
    }
  adjustTextarea(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
  }
  ngOnDestroy(): void {
    if(this.calling) {
      this.calling.unsubscribe() ;
      this.calling = null ;
    }
  }
}
