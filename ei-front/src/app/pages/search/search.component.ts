import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { Select, Store } from '@ngxs/store';

import { distinctUntilChanged, Observable, tap } from 'rxjs';

import { LimitationsService } from './limitations.service';
import { ChangeType, SearchTypeState } from './search.store';

import { InputRangeComponent } from '../../components/input-range/input-range.component';
import { IRentLimits, ISaleLimits } from '../../../../bff/types';


enum SearchTypeTab {
  rent,
  sale,
}

@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    MatTabsModule,
    InputRangeComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Select(SearchTypeState.searchType) type$!: Observable<'rent' | 'sale'>;

  public searchRentForm = new FormGroup({
    type: new FormControl(),
    city: new FormControl(),
    district: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),
  });

  public searchSaleForm = new FormGroup({
    type: new FormControl(),
    city: new FormControl(),
    district: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),
  });

  public rentLimits!: IRentLimits;
  public saleLimits!: ISaleLimits;

  public activeTabIndex: number = SearchTypeTab.rent;

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store,
    private readonly limitsService: LimitationsService,
  ) {
  }

  public ngOnInit(): void {
    this.rentLimits = this.limitsService.getRentLimits();
    this.saleLimits = this.limitsService.getSaleLimits();

    this.type$
      .pipe(
        distinctUntilChanged(),
        tap(((data) => console.log(data))),
        tap((type) => {
          this.activeTabIndex = SearchTypeTab[type];
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onTabIndexChange(index: number): void {
    const type = index === 0 ? 'rent' : 'sale';

    this.store.dispatch(new ChangeType(type));
  }
}
