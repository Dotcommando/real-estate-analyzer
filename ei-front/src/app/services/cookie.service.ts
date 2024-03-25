import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { CookieEnum } from '../constants';


@Injectable({
  providedIn: 'root',
})
export class CookieService {
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public setCookie(name: string, value: string, days = 365): void {
    if (isPlatformBrowser(this.platformId)) {

      let expires = '';

      if (days) {
        const date = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
      }

      document.cookie = name + '=' + (value || '') + expires + '; path=/';
    }
  }

  public getCookie(name: string | CookieEnum): string | null {
    if (isPlatformServer(this.platformId)) return null;

    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];

      while (c.charAt(0) === ' ') c = c.substring(1, c.length);

      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }

    return null;

  }

  public getBooleanCookie(name: string | CookieEnum): boolean {
    return this.getCookie(name) === 'true';
  }

  public getDateCookie(name: string | CookieEnum): Date | null {
    const rawValue = this.getCookie(name);

    if (!rawValue) {
      return null;
    }

    const processedValue = new Date(rawValue);

    return processedValue.toString() === 'Invalid Date'
      ? null
      : processedValue;
  }

  public deleteCookie(name: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  }
}
