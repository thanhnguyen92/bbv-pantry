import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

/** Models */
import { NotificationModel } from '../../models/notification.model';
import { NotificationEnum } from '../../enums/notification.enum';

/** Services */
import { NotificationService } from '../../services/notification.service';
import { Utilities } from '../../services/utilities';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { PushNotificationService } from '../../services/push-notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnDestroy {
  alerts: NotificationModel[] = [];
  defaultConfig: MatSnackBarConfig = {
    horizontalPosition: 'right',
    verticalPosition: 'top',
    duration: 3500
  };
  private notificationSubscription: Subscription;
  private errorHeader = '';
  private successHeader = '';
  private warningHeader = '';
  private informationHeader = '';

  constructor(private snackBar: MatSnackBar) {
    this.notificationSubscription = NotificationService.MessageObserver.subscribe(
      data => {
        switch (data.id) {
          case NotificationEnum.SUCCESS:
            this.showSuccess(data);
            break;
          case NotificationEnum.ERROR:
            this.showError(data);
            break;
          case NotificationEnum.WARNING:
            this.showWarning(data);
            break;
          case NotificationEnum.INFO:
            this.showInfo(data);
            break;
          default:
            break;
        }
      }
    );
  }

  ngOnDestroy(): void {
    Utilities.unsubscribe(this.notificationSubscription);
  }

  onClosed(dismissedAlert: any): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }

  private showSuccess(data) {
    if (data.i18n) {
      // let translated = this.translateService.instant(data.i18n, data.options);
      // if (data.message) {
      //   translated += ' ' + data.message;
      // }
      const translated = data.i18n;
      // this.alerts.push({
      //   type: 'success',
      //   header: this.successHeader,
      //   msg: translated,
      //   timeout: data.timeout
      // });

      this.snackBar.open(translated, '', {
        panelClass: 'success-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    } else if (data.message) {
      this.snackBar.open(data.message, '', {
        panelClass: 'success-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    }
  }

  private showError(data) {
    if (data.i18n) {
      // let translated = this.translateService.instant(data.i18n, data.options);
      // if (data.message) {
      //   translated += ' ' + data.message;
      // }
      const translated = data.i18n;
      this.snackBar.open(translated, '', {
        panelClass: 'error-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    } else if (data.message) {
      this.snackBar.open(data.message, '', {
        panelClass: 'error-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    }
  }

  private showWarning(data) {
    if (data.i18n) {
      // let translated = this.translateService.instant(data.i18n, data.options);
      // if (data.message) {
      //   translated += ' ' + data.message;
      // }
      const translated = data.i18n;
      this.snackBar.open(translated, '', {
        panelClass: 'warning-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    } else if (data.message) {
      this.snackBar.open(data.message, '', {
        panelClass: 'warning-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    }
  }

  private showInfo(data) {
    if (data.i18n) {
      // let translated = this.translateService.instant(data.i18n, data.options);
      // if (data.message) {
      //   translated += ' ' + data.message;
      // }
      const translated = data.i18n;
      this.snackBar.open(translated, '', {
        panelClass: 'info-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    } else if (data.message) {
      this.snackBar.open(data.message, '', {
        panelClass: 'info-message',
        ...{
          ...this.defaultConfig,
          ...{
            duration: data.timeout
          }
        }
      });
    }
  }
}
