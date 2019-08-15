import { UserRole } from '../enums/user-role.enum';

export class Security {
    uid: string;
    roles: UserRole[];
    userId: string;
}
