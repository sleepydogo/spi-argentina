import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpService } from './http.service';
import { Constants } from 'src/models/contants.models';

@Injectable({
  providedIn: 'root'
})
export class TripWatcherService {
  private tripSubject = new BehaviorSubject<any>(null);
  private intervalId: any;

  constructor(private httpService: HttpService) {}

  startPolling(interval: number) {
    this.stopPolling(); // Detiene cualquier polling previo
    this.intervalId = setInterval(async () => {
      try {
        const data = await this.httpService.GET_WithAuth(Constants.CURRENT_TRIP_ENDPOINT);
        this.tripSubject.next(data);
      } catch (error) {
        console.error('Error fetching trip data:', error);
      }
    }, interval);
  }

  stopPolling() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  getTripData(): Observable<any> {
    return this.tripSubject.asObservable();
  }
}
