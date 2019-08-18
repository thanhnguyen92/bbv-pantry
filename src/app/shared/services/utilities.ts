import { Subscription } from 'rxjs';

export class Utilities {
  static copy(object: any) {
    return JSON.parse(JSON.stringify(object));
  }

  static unsubscribe(subscription: Subscription) {
    if (subscription) {
      setTimeout(() => {
        subscription.unsubscribe();
      });
    }
  }

  static convertToUTC(date: Date) {
    return new Date(date.toUTCString());
  }
}
