import { BaseEntity } from './base.model';

export class PluginModel implements BaseEntity {
  id?: string;
  uid?: string;
  name?: string;
  url?: string;
  userId?: string;
}
