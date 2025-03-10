import { ServicesCallServiceService } from './../../core/services/servicesCallService/services-call-service.service';
import { Component, inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { EmployessService } from '../../core/services/employees/employess.service';
import { IEmployee } from '../../core/interfaces/iemployee';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser } from '@angular/common';
@Component({
  selector: 'app-service-details',
  imports: [RouterLink , TranslatePipe],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.css'
})
export class ServiceDetailsComponent implements OnInit , OnDestroy{
  currentLang: string = 'en';
  private translate = inject(TranslateService) ;
  private _PLATFORM_ID = inject (PLATFORM_ID) ;
  private readonly _ActivatedRoute = inject (ActivatedRoute)
  private router = inject(Router)
  constructor(private _ServicesCallServiceService: ServicesCallServiceService) {}
  private _EmployessService = inject(EmployessService) ;
  employeesData!:IEmployee[] ;
  callingApi:Subscription | null = null;;
  jobId!:string ;
  jobTitle!:string ;
  isLoading:boolean = true ;
  showNoChatsDiv = false;
  ngOnInit(): void {
    if(isPlatformBrowser(this._PLATFORM_ID)) {
      this.currentLang = sessionStorage.getItem('language') || 'en' ;
      this.translate.setDefaultLang(this.currentLang) ;
      this.translate.use(this.currentLang) ;
    }
    this._ActivatedRoute.paramMap.subscribe( {
      next : (param) => {
        this.jobId = param.get('jobId') ! ;
      }
    })
    this.callingApi = this._EmployessService.getEmployess(this.jobId).subscribe({
      next : (res) => {
        this.jobTitle = res.employees.job ;
        this.employeesData = res.employees ;
        this.isLoading = false ;
        if (this.employeesData.length === 0) {
          this.showNoChatsDiv = true;
        }
      } ,
      error: (err) => {
        this.isLoading = false;
        if (err?.error?.message === 'No employees found for this service') {
          this.showNoChatsDiv = true;
        }
      }
    }) ?? null
  }
  openEmployeeProfile(userId: string) {
    this.router.navigate(['/employee-profile', userId]);
  }
  ngOnDestroy(): void {
    if(this.callingApi) {
      this.callingApi.unsubscribe() ;
      this.callingApi = null ;
    }
  }
}
