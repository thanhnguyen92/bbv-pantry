import { BaseEntity } from './base.model';
import { UserRole } from '../enums/user-roles.enum';

export class SecurityModel implements BaseEntity {
    id?: string;
    roles: UserRole[];
    userId: string;
}
