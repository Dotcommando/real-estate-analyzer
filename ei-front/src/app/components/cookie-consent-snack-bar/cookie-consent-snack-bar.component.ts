import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

import { CookieConsentService } from '../../services';


@Component({
  selector: 'ei-cookie-consent-snack-bar',
  templateUrl: './cookie-consent-snack-bar.component.html',
  styleUrl: './cookie-consent-snack-bar.component.scss',
  standalone: true,
  imports: [
    MatButtonModule,
    RouterLink,
  ],
})
export class CookieConsentSnackComponent {
  constructor(
    private cookieConsentService: CookieConsentService,
  ) {
  }

  public dismiss(): void {
    this.cookieConsentService.acceptCookies();
  }
}
