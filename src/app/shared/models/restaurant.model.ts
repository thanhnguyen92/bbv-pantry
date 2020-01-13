import { BaseEntity } from './base.model';

export class RestaurantModel implements BaseEntity {
  id?: string;
  uid?: string;
  name?;
  phone?;
  location?;
}
