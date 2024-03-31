import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import { Meta, Title } from '@angular/platform-browser';

import { AbstractSeoFriendlyPageComponent } from '../../components/abstract-seo-friendly-page';
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
export class CookieConsentComponent extends AbstractSeoFriendlyPageComponent implements OnInit {
  public CookieNames = CookieEnum;

  constructor(
    meta: Meta,
    title: Title,
    private readonly cookieConsentService: CookieConsentService,
  ) {
    super(meta, title);

    this.metaTags = [
      { name: 'description', content: 'Cookie Consent of Cyprus Real Estate Search Engine' },
    ];

    this.titleTagContent = 'Cookie Consent of Cyprus Real Estate Search Engine';
  }

  public ngOnInit(): void {
    this.initMeta();
  }

  public onAgreeButtonClick(): void {
    this.cookieConsentService.acceptCookies();
  }
}
