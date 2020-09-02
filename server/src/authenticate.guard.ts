import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthenticateGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const { session } = context.switchToHttp().getRequest();
    console.log(session);

    return !!session.contactId;
  }
}
