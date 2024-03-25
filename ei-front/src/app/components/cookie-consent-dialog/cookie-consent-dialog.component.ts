import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { tap } from 'rxjs';

import { CookieConsentComponent } from '../../pages/cookie-consent/cookie-consent.component';
import { CookieConsentService } from '../../services';


@Component({
  selector: 'ei-cookie-consent-dialog',
  template: '',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentDialogComponent implements OnInit {
  private dialogRef!: MatDialogRef<CookieConsentComponent>;
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private cookieConsentService: CookieConsentService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.cookieConsentService.essentialCookieAccepted$
        .pipe(
          tap((accepted: boolean) => accepted
            ? this.closeDialog()
            : this.openDialog(),
          ),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    }
  }

  public openDialog(): void {
    this.dialogRef = this.dialog.open(CookieConsentComponent, {
      width: '600px',
      maxHeight: '90vh',
      maxWidth: '90vw',
      disableClose: true,
    });
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }
}
