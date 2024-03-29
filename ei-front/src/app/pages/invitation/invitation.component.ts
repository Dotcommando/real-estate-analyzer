import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import {
  catchError,
  debounce,
  distinctUntilChanged,
  filter,
  interval,
  map,
  NEVER,
  Observable,
  skip,
  tap,
} from 'rxjs';

import { InvitationService } from '../../services';
import {
  AddInvitationToken,
  InvitationState,
  ResetInvitation,
  ValidateInvitation,
  ValidateInvitationFail,
  ValidateInvitationSuccess,
} from '../../store/invitation';
import { IResponse } from '../../types';


const snackBarDurationMs = 3000;
const snackBarDurationSuccessMs = 2200;

@Component({
  selector: 'ei-invitation',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    MatIcon,
    AsyncPipe,
    MatSnackBarModule,
  ],
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationComponent implements OnInit {
  @Select(InvitationState.invitationToken) invitationToken!: Observable<string | null>;
  @Select(InvitationState.invitationRequestStatus) requestStatus!: Observable<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'>;
  public invitationField = new FormControl();
  public isAddInvitationDisabled$ = this.requestStatus
    .pipe(
      distinctUntilChanged(),
      map((value: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED') => value === 'PENDING' || value === 'SUCCESS'),
    );
  public removalButtonIsVisible$ = this.requestStatus
    .pipe(
      distinctUntilChanged(),
      map((value: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED') => value === 'SUCCESS'),
    );
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private store: Store,
    private snackBar: MatSnackBar,
    private invitationService: InvitationService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.requestStatus
      .pipe(
        skip(1),
        debounce(() => interval(40)),
        distinctUntilChanged(),
        tap((value: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED') => {
          this.snackBar.open(value === 'SUCCESS'
            ? 'Invitation code accepted. Welcome!'
            : 'Invalid invitation code. Please try again.',
          'Close',
          { duration: value === 'SUCCESS' ? snackBarDurationSuccessMs : snackBarDurationMs },
          );
        }),
        filter((value: 'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED') => value === 'SUCCESS'),
        debounce(() => interval(snackBarDurationSuccessMs)),
        tap(() => this.router.navigateByUrl('/search')),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public addInvitation(): void {
    const rawToken = this.invitationField.value;

    if (!rawToken?.trim()) {
      this.snackBar.open('Please enter a valid invitation code.', 'Close', { duration: snackBarDurationMs });

      return;
    }

    this.store.dispatch(new ValidateInvitation());

    this.invitationService.validateInvitationToken(rawToken)
      .pipe(
        tap((response: IResponse<{ valid: boolean }>) => {
          if (response.data?.valid) {
            this.store.dispatch(new AddInvitationToken(rawToken));
            this.store.dispatch(new ValidateInvitationSuccess());
            this.invitationField.setValue('');
          } else {
            this.store.dispatch(new ValidateInvitationFail());
          }
        }),
        catchError(() => {
          this.store.dispatch(new ValidateInvitationFail());
          this.snackBar.open('An error occurred while validating the invitation code. Please try again later.', 'Close', { duration: snackBarDurationMs });

          return NEVER;
        }),
      )
      .subscribe();
  }

  public removeInvitation(): void {
    this.store.dispatch(new AddInvitationToken(null));
    this.store.dispatch(new ResetInvitation());
  }
}
