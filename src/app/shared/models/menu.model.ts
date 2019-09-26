import { BaseEntity } from './base.model';

export class MenuModel implements BaseEntity {
  id?: string;
  uid?: string;
  name: string;
  price?: number;
  notes?: string;
  restaurantId?: string;
  restaurantName?: string;
}
