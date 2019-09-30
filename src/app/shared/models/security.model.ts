import { UserRole } from '../enums/user-role.enum';
import { BaseEntity } from './base.model';

export class SecurityModel implements BaseEntity {
    id?: string;
    roles: UserRole[];
    userId: string;
}
