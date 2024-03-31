import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatList, MatListItem } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';

import { CookieConsentService, ThemeService } from './services';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MatSidenavModule,
    RouterLink,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    AsyncPipe,
    MatList,
    MatListItem,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  public currentTheme$ = this.themeService.currentTheme$;

  constructor(
    private themeService: ThemeService,
    private cookieConsentService: CookieConsentService,
  ) {
  }

  public ngOnInit(): void {
    this.cookieConsentService.checkAndShowConsent();
  }

  public toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
