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
        ...(city.districts?.length ? { districts: city.districts.slice().sort() } : { districts: []}),
      }))
      .sort((a, b) => (a.city as string).localeCompare(b.city as string));
    sortedRentLimits.limits.bedrooms = sortedRentLimits.limits.bedrooms.sort((a, b) => a - b);
    sortedRentLimits.limits.bathrooms = sortedRentLimits.limits.bathrooms.sort((a, b) => a - b);
    sortedRentLimits.categories = sortedRentLimits.categories.sort((a, b) => a.category >= b.category ? 1 : -1);

    sortedRentLimits.categories.map((category) => {
      category.subcategories = category.subcategories
        .filter((subcategory) => Boolean(subcategory) && subcategory.length > 1)
        .sort();
    });

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
        ...(city.districts?.length ? { districts: city.districts.slice().sort() } : { districts: []}),
      }))
      .sort((a, b) => (a.city as string).localeCompare(b.city as string));
    sortedSaleLimits.limits.bedrooms = sortedSaleLimits.limits.bedrooms.sort((a, b) => a - b);
    sortedSaleLimits.limits.bathrooms = sortedSaleLimits.limits.bathrooms.sort((a, b) => a - b);
    sortedSaleLimits.categories = sortedSaleLimits.categories.sort((a, b) => a.category >= b.category ? 1 : -1);

    sortedSaleLimits.categories.map((category) => {
      category.subcategories = category.subcategories
        .filter((subcategory) => Boolean(subcategory) && subcategory.length > 1)
        .sort();
    });

    return sortedSaleLimits;
  }
}
