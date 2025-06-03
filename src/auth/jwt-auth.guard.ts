import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CURRENT_USER_KEY } from 'src/@core/utils/constants';
import { AuthService } from './auth.service';
import { JWTPayloadType } from 'src/@core/utils/types';
import { UserRole } from 'src/@core/utils/enums';
import { Reflector } from '@nestjs/core';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = request.res;
    const roles: UserRole[] = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return false;
    }

    const accessToken = request.cookies['accessToken'];
    const refreshToken = request.cookies['refreshToken'];

    if (!accessToken) {
      return false;
    }
    if (!refreshToken) {
      return false;
    }

    try {
      const result = await this.authService.verifyToken(accessToken);

      if (!result) {
        return false;
      }
      const { decoded, user }: { decoded: JWTPayloadType; user: User } = result;

      if (!decoded || !user) {
        return false;
      }

      if (roles.includes(user.role)) {
        request[CURRENT_USER_KEY] = decoded;
        return true;
      }

      return false;
    } catch (error) {
      if (error.name === 'TokenExpiredError' && refreshToken) {
        try {
          const result = await this.authService.refreshToken(
            refreshToken,
            response,
          );

          if (result.success && result.accessToken) {
            // ✅ أعد التحقق من التوكن الجديد
            const recheck = await this.authService.verifyToken(
              result.accessToken,
            );
            if (!recheck) return false;

            const { decoded, user } = recheck;

            if (roles.includes(user.role)) {
              request[CURRENT_USER_KEY] = decoded;
              return true;
            }
            return false;
          } else {
            throw new UnauthorizedException('Refresh token is invalid');
          }
        } catch (refreshError) {
          throw new UnauthorizedException('Refresh token expired');
        }
      }

      throw new UnauthorizedException('Invalid token');
    }
  }
}
