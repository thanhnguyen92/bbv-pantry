import { BaseEntity } from './base.model';

export class Menu implements BaseEntity {
  uid?: string;
  name: string;
  price?: number;
  notes?: string;
  restaurantId?: string;
  restaurantName?: string;
}
