import { SetMetadata } from '@nestjs/common';
import { AccountRoleEnum } from '../../auth/enums/account-role.enum';

export const rolesKey = 'role';
export const Role = (role: AccountRoleEnum): any => SetMetadata(rolesKey, role);
