import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { CookieService } from './cookie.service';

import { CookieEnum } from '../constants';


@Injectable({
  providedIn: 'root',
})
export class CookieConsentService {
  private essentialCookieAcceptedSubject$ = new BehaviorSubject<boolean>(this.cookieService.getBooleanCookie(CookieEnum.CookieConsentAccepted));
  public essentialCookieAccepted$ = this.essentialCookieAcceptedSubject$.asObservable();

  private essentialCookieAcceptanceDateSubject$ = new BehaviorSubject<Date | null>(this.cookieService.getDateCookie(CookieEnum.CookieConsentAcceptanceDate));
  public essentialCookieAcceptanceDate$ = this.essentialCookieAcceptanceDateSubject$.asObservable();

  constructor(
    private cookieService: CookieService,
  ) {
  }

  public acceptEssentialCookies(): void {
    const acceptanceDate = new Date();

    this.cookieService.setCookie(CookieEnum.CookieConsentAccepted, 'true');
    this.cookieService.setCookie(CookieEnum.CookieConsentAcceptanceDate, acceptanceDate.toISOString());
    this.essentialCookieAcceptedSubject$.next(true);
    this.essentialCookieAcceptanceDateSubject$.next(acceptanceDate);
  }
}
