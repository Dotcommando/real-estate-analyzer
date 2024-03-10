import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { fallBackRentLimits, fallBackSaleLimits } from '../../../../bff/fall-backs';
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
    } else if (isPlatformServer(this.platformId)) {
      this.rentLimits = fallBackRentLimits;
      this.saleLimits = fallBackSaleLimits;
    }
  }

  public getRentLimits(): IRentLimits {
    const sortedRentLimits = { ...this.rentLimits };

    sortedRentLimits.cities = (this.rentLimits?.cities
      ? this.rentLimits.cities
      : fallBackRentLimits.cities
    )
      .map(city => ({
        ...city,
        districts: city.districts.slice().sort(),
      }))
      .sort((a, b) => a.city.localeCompare(b.city));

    return sortedRentLimits;
  }

  public getSaleLimits(): ISaleLimits {
    const sortedSaleLimits = { ...this.saleLimits };

    sortedSaleLimits.cities = (this.saleLimits?.cities
      ? this.saleLimits.cities
      : fallBackSaleLimits.cities
    )
      .map(city => ({
        ...city,
        districts: city.districts.slice().sort(),
      }))
      .sort((a, b) => a.city.localeCompare(b.city));

    return sortedSaleLimits;
  }
}