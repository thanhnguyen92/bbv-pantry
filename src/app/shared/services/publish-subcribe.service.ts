import { Injectable } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublishSubcribeService {
  private publishSubscribeSubject: Subject<any> = new Subject<any>();
  private emitter: Observable<any>;
  constructor() {
    this.emitter = this.publishSubscribeSubject.asObservable();
  }

  publish(channel: string, event: any): void {
    this.publishSubscribeSubject.next({
      channel: channel,
      event: event
    });
  }

  subscribe(channel: string, handler: (value: any) => void): Subscription {
    return this.emitter
      .pipe(
        filter(emission => emission.channel === channel),
        map(emission => emission.event)
      )
      .subscribe(handler);
  }
}
