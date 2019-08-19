import { Subscription } from 'rxjs';
import { Query, CollectionReference } from '@angular/fire/firestore';

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

  static buildQueryGetByPropWithArray(prop: string, arr: string[]): (ref: CollectionReference) => Query {
    return (ref: CollectionReference) => {
      let expression: Query = ref.where(prop, '==', arr[0]);
      arr.forEach((item, idx) => {
        if (idx > 0) {
          expression.where(prop, '==', item)
        }
      });
      return expression;
    };
  }
}
