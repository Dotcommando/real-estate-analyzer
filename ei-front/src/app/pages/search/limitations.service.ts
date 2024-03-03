import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { IRentLimits, ISaleLimits } from '../../../../bff/types';


declare const rentLimits: IRentLimits;
declare const saleLimits: ISaleLimits;

@Injectable({
  providedIn: 'root',
})
export class LimitationsService {
  private rentLimits!: IRentLimits;
  private saleLimits!: ISaleLimits;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.rentLimits = rentLimits;
      this.saleLimits = saleLimits;
    }
  }

  public getRentLimits(): IRentLimits {
    return this.rentLimits;
  }

  public getSaleLimits(): ISaleLimits {
    return this.saleLimits;
  }
}
