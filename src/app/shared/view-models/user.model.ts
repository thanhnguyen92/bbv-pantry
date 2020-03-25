import { UserModel } from '../models/user.model';

export interface UserViewModel extends UserModel {
    roles: any[];
}
