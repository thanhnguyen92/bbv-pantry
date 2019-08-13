import { BaseEntity } from './base.model';

export class RestaurantModel implements BaseEntity {
  uid?: string;
  name?;
  phone?;
  location?;
}
