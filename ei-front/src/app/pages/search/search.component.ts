import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { Select, Store } from '@ngxs/store';

import { debounce, distinctUntilChanged, interval, Observable, tap } from 'rxjs';

import { LimitationsService } from './limitations.service';
import { ISearchForm } from './search.model';
import { ChangeType, SearchTypeState, UpdateRentSearchState, UpdateSaleSearchState } from './search.store';

import { IRentLimits, ISaleLimits } from '../../../../bff/types';
import {
  CityDistrictSelectorComponent,
} from '../../components/city-district-selector/city-district-selector.component';
import { InputRangeComponent } from '../../components/input-range/input-range.component';
import { MultiAutocompleteComponent } from '../../components/multi-autocomplete/multi-autocomplete.component';
import { mapSearchFormToState } from '../../mappers';


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
    MatSelect,
    MatLabel,
    MatFormField,
    MatOption,
    MultiAutocompleteComponent,
    CityDistrictSelectorComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Select(SearchTypeState.searchType) type$!: Observable<'rent' | 'sale'>;

  public searchRentForm = new FormGroup({
    type: new FormControl(),
    cityDistrict: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),
  });

  public searchSaleForm = new FormGroup({
    type: new FormControl(),
    cityDistrict: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),
  });

  public rentLimits!: IRentLimits;
  public saleLimits!: ISaleLimits;

  public activeTabIndex: number = SearchTypeTab.rent;
  public maxDistrictItems = 5;

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

    this.trackSearchForm$(this.searchRentForm.valueChanges)
      .pipe(
        tap(data => console.log(data)),
        tap((searchForm: Partial<ISearchForm>) => this.store.dispatch(
          new UpdateRentSearchState(mapSearchFormToState(searchForm)),
        )),
      )
      .subscribe();

    this.trackSearchForm$(this.searchSaleForm.valueChanges)
      .pipe(
        tap((searchForm: Partial<ISearchForm>) => this.store.dispatch(
          new UpdateSaleSearchState(mapSearchFormToState(searchForm)),
        )),
      )
      .subscribe();
  }

  public onTabIndexChange(index: number): void {
    const type = index === 0 ? 'rent' : 'sale';

    this.store.dispatch(new ChangeType(type));
  }

  private trackSearchForm$(
    formSource$: Observable<Partial<ISearchForm>>,
  ) {
    return formSource$
      .pipe(
        debounce(() => interval(400)),
        tap((data) => console.log(data)),
        takeUntilDestroyed(this.destroyRef),
      );
  }
}
