import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile } from '../../interfaces/userprofile';
import { enviroment } from '../../../shared/enviroment/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  getUserProfile(userId: string): Observable<{ user: UserProfile }> {
    return this.http.get<{ user: UserProfile }>(`${enviroment.baseUrl}/api/user/profile/${userId}`);
  }
  updateUserProfile(userId:string , userData:any):Observable<any> {
    return this.http.post(`${enviroment.baseUrl}/api/user/update/${userId}`, userData)
  }
}
