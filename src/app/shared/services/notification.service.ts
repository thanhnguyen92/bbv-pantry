import { Subject } from 'rxjs';
import { NotificationEnum } from '../enums/notification.enum';

export class NotificationService {
  private static message = new Subject<any>();
  static MessageObserver = NotificationService.message.asObservable();

  static showSuccessMessage(
    translationCode: string = '',
    message: string = '',
    timeout: number = 3500
  ) {
    this.message.next({
      id: NotificationEnum.SUCCESS,
      i18n: translationCode,
      message,
      timeout
    });
  }

  static showErrorMessage(
    messageCode: string = '',
    message: string = '',
    timeout: number = 3500
  ) {
    this.message.next({
      id: NotificationEnum.ERROR,
      i18n: messageCode,
      message,
      timeout
    });
  }

  static showWarningMessage(
    messageCode: string = '',
    message: string = '',
    options = {},
    timeout: number = 3500
  ) {
    this.message.next({
      id: NotificationEnum.WARNING,
      i18n: messageCode,
      message,
      options,
      timeout
    });
  }

  static showInfoMessage(
    messageCode: string = '',
    message: string = '',
    options = {},
    timeout: number = 3500
  ) {
    this.message.next({
      id: NotificationEnum.INFO,
      i18n: messageCode,
      message,
      options,
      timeout
    });
  }

  static showNotificationWindows(type) {
    if (!('Notification' in window)) {
      alert('This browser does not support system notifications');
    } else if (Notification.permission === 'granted') {
      const notification = new Notification('show Notification success!!');
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission(permission => {
        if (permission === 'granted') {
          const notification = new Notification('show Notification success!!');
        }
      });
    }
  }

  static requestPermissionNotificationWindows() {
    Notification.requestPermission().then(res => {
      console.log('granted');
    });
  }
}
