import { BaseEntity } from './base.model';

export class HappyHoursModel implements BaseEntity {
  id?: string;
  uid?: string;
  name: string;
  email?: string;
}
