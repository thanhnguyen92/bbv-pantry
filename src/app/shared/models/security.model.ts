import { UserRole } from '../enums/user-role.enum';
import { BaseEntity } from './base.model';

export class Security implements BaseEntity {
    uid?: string;
    roles: UserRole[];
    userId: string;
}
