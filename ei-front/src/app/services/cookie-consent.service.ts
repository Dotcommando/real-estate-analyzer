import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { CookieService } from './cookie.service';

import { CookieConsentSnackComponent } from '../components/cookie-consent-snack-bar/cookie-consent-snack-bar.component';
import { CookieEnum } from '../constants';


@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  constructor(
    private snackBar: MatSnackBar,
    private cookieService: CookieService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public checkAndShowConsent(): void {
    const consentGiven = this.cookieService.getBooleanCookie(CookieEnum.CookieConsentAccepted);

    if (isPlatformBrowser(this.platformId) && !consentGiven) {
      this.snackBar.openFromComponent(CookieConsentSnackComponent, {
        duration: 0,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: [ 'cookie-consent-snackbar' ],
      });
    }
  }

  public acceptCookies(): void {
    const acceptanceDate = new Date();

    this.cookieService.setCookie(CookieEnum.CookieConsentAccepted, 'true');
    this.cookieService.setCookie(CookieEnum.CookieConsentAcceptanceDate, acceptanceDate.toISOString());
    this.snackBar.dismiss();
  }
}
