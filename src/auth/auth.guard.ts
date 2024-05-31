import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { IS_PUBLIC_KEY } from 'src/decorators/public.decorator';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    try {
      const request = context.switchToHttp().getRequest();
      const { authorization }: any = request.headers;

      // authorization header missing
      if (!authorization || authorization.trim() === '') {
        throw new UnauthorizedException('Please provide authorization token');
      }

      return this.authService.verifyToken(authorization.toString());
    } catch (error) {
      console.error('[canActivate()::AuthenticationError]::', error.message);
      throw new ForbiddenException(error.message || 'Session expired! Please sign In');
    }
  }
}
