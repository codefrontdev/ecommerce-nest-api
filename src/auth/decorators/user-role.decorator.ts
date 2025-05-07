import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/@core/utils/enums';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
