import { Subscription } from 'rxjs';
import { Query, CollectionReference } from '@angular/fire/firestore';
import * as moment from 'moment';

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

  /**
   * Convert from timestamp to Date
   * @param timestamp Value as timestamp
   */
  static convertTimestampToDate(timestamp) {
    if (timestamp) {
      return new Date(timestamp.seconds * 1000);
    }

    return new Date();
  }

  static buildQueryGetByPropWithArray(prop: string, arr: string[]): (ref: CollectionReference) => Query {
    return (ref: CollectionReference) => {
      const expression: Query = ref.where(prop, '==', arr[0]);
      arr.forEach((item, idx) => {
        if (idx > 0) {
          expression.where(prop, '==', item);
        }
      });
      return expression;
    };
  }

  /**
   * Compare two dates
   * = 0 : 2 dates are equal
   * > 0 : Date 1 is larger than Date 2
   * < 0 : Date 1 is smaller than Date 2
   * @param date1 Date 1 is the main date
   * @param date2 Date 2 to compare with Date 1
   */
  public static compareDates(date1: Date, date2: Date, withoutTime?: boolean): number {
    const date1tmp = new Date(date1.getTime());
    const date2tmp = new Date(date2.getTime());

    if (withoutTime) {
      date1tmp.setHours(0, 0, 0, 0);
      date2tmp.setHours(0, 0, 0, 0);
    }
    return moment(date1tmp).diff(moment(date2tmp));
  }
}
