import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Observable } from 'rxjs';

import { DbAccessService } from '../services';


@Injectable()
export class InvitationGuard implements CanActivate {
  constructor(
    private readonly dbAccessService: DbAccessService,
  ) {
  }

  public canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const invitationToken = request.headers['invitation-token'];

    if (!invitationToken) {
      return false;
    }

    return this.dbAccessService.validateInvitation(invitationToken);
  }
}
