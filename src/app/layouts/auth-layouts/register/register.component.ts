import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { IRegister } from './../../../core/interfaces/iregister';
import { RegisteritionService } from './../../../core/services/register/registerition.service';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import emailjs from '@emailjs/browser';
@Component({
  selector: 'app-register',
  imports: [FormsModule , ReactiveFormsModule , TranslatePipe , RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit , OnDestroy {
  email: string = '';
  currentLang!:string ;
  emailExists: boolean = false;
  done!: boolean;
  atChar:string = '@' ;
  callingForm:Subscription | null = null;
  isLoading:boolean = false ;
  errorMessage:string = 'Email Is Already Exsits !' ;
  private _TranslateService = inject(TranslateService) ;
  private readonly _PLATFORM_ID = inject(PLATFORM_ID) ;
  ngOnInit(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.updateDirection();
      this._TranslateService.onLangChange.subscribe(() => {
        this.updateDirection();
      });
    }
  }
  updateDirection(): void {
    if (isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = this._TranslateService.currentLang || 'en';
      document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = this.currentLang;
    }
    this.registerFormData.get('repassword')?.valueChanges.subscribe(() => {
      this.compare();
    })!;
    this.registerFormData.get('password')?.valueChanges.subscribe(() => {
      this.compare();
    })!;
  }
  private _RegisteritionService = inject(RegisteritionService) ;
  registerData!:IRegister ;
  registerFormData: FormGroup = new FormGroup({
    firstName: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z\s]{3,10}$/)]),
    lastName: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z\s]{3,10}$/)]),
    email: new FormControl(null, [Validators.required, Validators.email , Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/) ]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
    ]),
    repassword: new FormControl(null, [Validators.required]),
    contactNumber: new FormControl(null, [Validators.required, Validators.pattern(/^01[0-2,5]\d{8}$/)]),
    role: new FormControl(null, [Validators.required]),
    job: new FormControl(null, [Validators.required])
  });
  constructor() {
    this.registerFormData.get('role')?.valueChanges.subscribe(role => {
      if (role === 'customer') {
        this.registerFormData.get('job')?.clearValidators();
      } else {
        this.registerFormData.get('job')?.setValidators([Validators.required]);
      }
      this.registerFormData.get('job')?.updateValueAndValidity();
    })!;
  }
  compare(): void {
    const password = this.registerFormData.get('password')?.value;
    const repassword = this.registerFormData.get('repassword')?.value;
    if (password !== repassword) {
      this.registerFormData.get('repassword')?.setErrors({ notMatch: true });
    } else {
      this.registerFormData.get('repassword')?.setErrors(null);
    }
  }
  otp!: number;
  enteredOtp: string = '';
  submitForm(): void {
    this.isLoading = true;
    if (this.registerFormData.valid) {
      const registerData = {
        firstName: this.registerFormData.value.firstName,
        lastName: this.registerFormData.value.lastName,
        email: this.registerFormData.value.email,
        password: this.registerFormData.value.password,
        contactNumber: this.registerFormData.value.contactNumber,
        role: this.registerFormData.value.role,
        job: this.registerFormData.value.job
      };
      this.otp = Math.floor(100000 + Math.random() * 900000);
      const emailParams = {
        to_name: `${registerData.firstName} ${registerData.lastName}`,
        to_email: registerData.email,
        otp: this.otp,
        from_name: 'Dream Home'
      };
      emailjs.send('service_jvhehwc', 'template_4awkb0x', emailParams, 'qQPM3s3-KlvBI6JzW')
        .then(() => {
          console.log('✅ OTP Sent Successfully!');
          this.done = true;
        })
        .catch((error) => {
          console.error('❌ Failed to send OTP:', error);
        });
      this.isLoading = false;
    } else {
      this.registerFormData.markAllAsTouched();
      this.isLoading = false ;
    }
  }
  endOfOtp!:boolean ;
  verifyAndSubmit(): void {
    if (parseInt(this.enteredOtp) === this.otp) {
      const registerData = {
        firstName: this.registerFormData.value.firstName,
        lastName: this.registerFormData.value.lastName,
        email: this.registerFormData.value.email,
        password: this.registerFormData.value.password,
        contactNumber: this.registerFormData.value.contactNumber,
        role: this.registerFormData.value.role,
        job: this.registerFormData.value.job
      };
      this.isLoading = true;
      this.callingForm = this._RegisteritionService.signUp(registerData).subscribe({
        next: () => {
          alert('✅ Registration Successful!');
          this.registerFormData.reset();
          this.emailExists = false;
          this.isLoading = false;
        },
        error: (error) => {
          if (error.status === 400 && error.error?.message === 'User already exists') {
            this.emailExists = true;
            this.done = false ;
          } else {
            console.error('❌ Registration Error:', error);
          }
          this.isLoading = false;
        }
      });
    } else {
      alert('❌ Incorrect OTP. Please try again.');
    }
  }
  getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.registerFormData.controls).forEach((key) => {
      const controlErrors = this.registerFormData.get(key)?.errors;
      if (controlErrors) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }
  closeModal(): void {
    this.done = false;
  }
passwordVisible:boolean = false;
repasswordVisible:boolean = false;

togglePasswordVisibility() {
  this.passwordVisible = !this.passwordVisible;
}
togglerePasswordVisibility() {
  this.repasswordVisible = !this.repasswordVisible;
}

  ngOnDestroy(): void {
    if (this.callingForm) {
    this.callingForm.unsubscribe() ;
    this.callingForm = null;
  }}
}
