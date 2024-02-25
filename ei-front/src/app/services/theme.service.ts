import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

import { APP_THEME } from '../tokens';


export type Theme = 'dark' | 'light';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private currentThemeSubject$ = new BehaviorSubject<Theme>('dark');
  public currentTheme$: Observable<Theme> = this.currentThemeSubject$.asObservable();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(APP_THEME) private initialTheme: 'dark' | 'light',
  ) {
    const preferredTheme = this.getPreferredTheme();

    if (isPlatformBrowser(this.platformId)) {
      this.setTheme(preferredTheme ? preferredTheme : initialTheme);
    } else {
      this.setTheme(initialTheme === 'dark' ? 'dark' : 'light');
    }
  }

  public setTheme(theme: Theme): void {
    if (isPlatformBrowser(this.platformId)) {
      const body = this.document.getElementsByTagName('body')[0];

      body.classList.remove('dark-theme', 'light-theme');
      body.classList.add(`${theme}-theme`);
      document.cookie = `user-theme=${theme};path=/;max-age=31536000`;

      this.currentThemeSubject$.next(theme);
    }
  }

  public getPreferredTheme(): Theme | null {
    if (isPlatformBrowser(this.platformId)) {
      const match = document.cookie.match(/user-theme=(dark|light)/);

      if (match && (match[1] === 'dark' || match[1] === 'light')) {
        return match[1] as Theme;
      }

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }

      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }

    return null;
  }

  public toggleTheme(): void {
    this.setTheme(this.getPreferredTheme() === 'dark' ? 'light' : 'dark');
  }
}
