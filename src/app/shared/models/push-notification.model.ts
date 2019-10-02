import { BaseEntity } from './base.model';

export class PushNotificationModel implements BaseEntity {
  id?: string;
  email?: string;
  userId?: string;
  type?: number;
  message?: string;
  dateTime?: Date;
}
