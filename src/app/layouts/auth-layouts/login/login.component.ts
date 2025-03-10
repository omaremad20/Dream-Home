import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Login } from '../../../core/interfaces/login';
import { LoginService } from '../../../core/services/login.service';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/Auth/auth.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, TranslatePipe, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit , OnDestroy {
  private _AuthService = inject(AuthService);
  private _LoginService = inject(LoginService);
  private _TranslateService = inject(TranslateService);
  private _Router = inject(Router);
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
  loginError!:boolean ;
  isLoading:boolean = false ;
  currentLang!:string
  callingForm: Subscription | null = null;
  loginData!: Login;
  sumbited!:boolean ;
  passwordVisible:boolean = false;
  loginFormData: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email , Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/)]),
    password: new FormControl(null, [Validators.required , Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)])});
  showModal: boolean = false;
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
      this.currentLang = this._TranslateService.currentLang || 'en';
      document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
    }
  }

  showLoginData(): void {
    this.sumbited = true ;
    this.isLoading = true ;
    if (this.loginFormData.valid) {
      this.callingForm = this._LoginService.login(this.loginFormData.value).subscribe({
        next: (response) => {
          this._AuthService.login(response.user._id ,  response.user.role);
          this.loginFormData.reset() ;
          this.showModal = true;
          this.isLoading = false ;
          this.loginError = false ;
        },
        error: (err) => {
          if (err?.error?.message === 'Check your email and password') {
            this.loginError = true ;
            this.isLoading = false ;
          }
        }
      })??null;
    } else {
      this.loginFormData.markAllAsTouched() ;
      this.isLoading = false ;
    }
  }
  closeModal(): void {
    this.showModal = false;
    this._Router.navigate(['/dreamhome']);
  }

togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}
  ngOnDestroy(): void {
    if(this.callingForm) {
      this.callingForm.unsubscribe() ;
      this.callingForm = null ;
    }
  }
}
