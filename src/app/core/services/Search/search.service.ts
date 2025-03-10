import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchSubject = new BehaviorSubject<string>('');
  searchText$ = this.searchSubject.asObservable();

  updateSearchText(text: string) {
    this.searchSubject.next(text);
  }
}
