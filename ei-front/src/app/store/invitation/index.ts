import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';


export interface IInvitationState {
  status: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED';
  token: string | null;
}

export const initialState: IInvitationState = {
  status: 'IDLE',
  token: null,
};

export class AddInvitationToken {
  static readonly type = '[Invitation] Add Invitation';
  constructor(public token: string | null) {}
}

export class ValidateInvitation {
  static readonly type = '[Invitation] Validate Invitation';
}

export class ValidateInvitationSuccess {
  static readonly type = '[Invitation] Validate Invitation Success';
}

export class ValidateInvitationFail {
  static readonly type = '[Invitation] Validate Invitation Failed';
}

export class ResetInvitation {
  static readonly type = '[Invitation] Reset Invitation';
}

@State<IInvitationState>({
  name: 'invitation',
  defaults: initialState,
})
@Injectable()
export class InvitationState {
  @Selector()
  static invitationToken(state: IInvitationState): string | null {
    return state.token;
  }

  @Selector()
  static invitationRequestStatus(state: IInvitationState): 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED' {
    return state?.status ?? 'IDLE';
  }

  @Action(AddInvitationToken)
  public addInvitationToken(ctx: StateContext<IInvitationState>, action: AddInvitationToken): void {
    ctx.patchState({ token: action.token });
  }

  @Action(ValidateInvitation)
  public validateInvitation(ctx: StateContext<IInvitationState>): void {
    ctx.patchState({ status: 'PENDING' });
  }

  @Action(ValidateInvitationSuccess)
  public validateInvitationSuccess(ctx: StateContext<IInvitationState>): void {
    ctx.patchState({ status: 'SUCCESS' });
  }

  @Action(ValidateInvitationFail)
  public validateInvitationFail(ctx: StateContext<IInvitationState>): void {
    ctx.patchState({ status: 'FAILED' });
  }

  @Action(ResetInvitation)
  public resetInvitation(ctx: StateContext<IInvitationState>): void {
    ctx.patchState({ status: 'IDLE' });
  }
}

