import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

import { APP_THEME } from '../tokens';


@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_THEME) private initialTheme: 'dark' | 'light',
  ) {
    if (this.initialTheme) {
      this.setTheme(this.initialTheme);
    }
  }

  public setTheme(theme: 'dark' | 'light'): void {
    if (isPlatformBrowser(this.platformId)) {
      const body = this.document.getElementsByTagName('body')[0];

      body.classList.remove('dark-theme', 'light-theme');
      body.classList.add(`${theme}-theme`);
      document.cookie = `user-theme=${theme};path=/;max-age=31536000`;
    }
  }

  public getPreferredTheme(): 'dark' | 'light' {
    if (isPlatformBrowser(this.platformId)) {
      const match = document.cookie.match(/user-theme=(dark|light)/);

      if (match) {
        return match[1] as 'dark' | 'light';
      }

      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    return 'dark';
  }
}
