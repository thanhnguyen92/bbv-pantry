import { BaseEntity } from './base.model';

export class PushNotificationModel implements BaseEntity {
  uid?: string;
  email?: string;
  userId?: string;
  type?: number;
  message?: string;
}
