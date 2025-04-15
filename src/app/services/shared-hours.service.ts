import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedHoursService {
  private generalHoursSource = new BehaviorSubject<number>(0);
  currentGeneralHours = this.generalHoursSource.asObservable();

  updateGeneralHours(hours: number) {
    this.generalHoursSource.next(hours);
  }
}