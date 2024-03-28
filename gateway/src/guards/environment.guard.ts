import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';


@Injectable()
export class EnvironmentGuard implements CanActivate {
  constructor(
    private mode: 'dev' | 'prod',
    private allowedEnv: 'dev' | 'prod',
  ) {
  }

  public canActivate(context: ExecutionContext): boolean {
    return this.mode === this.allowedEnv;
  }
}
