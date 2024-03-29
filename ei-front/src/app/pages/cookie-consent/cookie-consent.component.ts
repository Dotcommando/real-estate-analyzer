import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';

import { CookieEnum } from '../../constants';
import { CookieConsentService } from '../../services';


@Component({
  selector: 'ei-cookie-consent',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatCardActions,
    MatButton,
    MatIcon,
    MatDivider,
  ],
  templateUrl: './cookie-consent.component.html',
  styleUrl: './cookie-consent.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CookieConsentComponent {
  public CookieNames = CookieEnum;

  constructor(
    private readonly cookieConsentService: CookieConsentService,
  ) {
  }

  public onAgreeButtonClick(): void {
    this.cookieConsentService.acceptEssentialCookies();
  }
}
