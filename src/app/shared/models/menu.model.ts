import { BaseEntity } from './base.model';

export class MenuModel implements BaseEntity {
  uid?: string;
  name: string;
  price?: number;
  notes?: string;
  restaurantId?: string;
  restaurantName?: string;
}
