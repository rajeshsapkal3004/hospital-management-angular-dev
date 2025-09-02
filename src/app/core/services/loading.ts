import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Loading {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }

  showLoading(): void {
    this.setLoading(true);
  }

  hideLoading(): void {
    this.setLoading(false);
  }
  
}
