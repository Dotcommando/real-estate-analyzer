import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatOption, MatSelect } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { Select, Store } from '@ngxs/store';

import { debounce, distinctUntilChanged, interval, Observable, take, tap } from 'rxjs';

import { LimitationsService } from './limitations.service';
import { ISearchForm, ISearchState } from './search.model';
import {
  ChangeType,
  SearchRentState,
  SearchSaleState,
  SearchTypeState,
  UpdateRentSearchState,
  UpdateSaleSearchState,
} from './search.store';

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
  @Select(SearchRentState) rentState$!: Observable<ISearchState>;
  @Select(SearchSaleState) saleState$!: Observable<ISearchState>;

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
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.rentLimits = this.limitsService.getRentLimits();
    this.saleLimits = this.limitsService.getSaleLimits();

    this.restoreFormState(this.rentState$, this.searchRentForm);
    this.restoreFormState(this.saleState$, this.searchSaleForm);

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
        tap((searchForm: Partial<ISearchForm>) => this.store.dispatch(
          new UpdateRentSearchState(mapSearchFormToState(searchForm)),
        )),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.trackSearchForm$(this.searchSaleForm.valueChanges)
      .pipe(
        tap((searchForm: Partial<ISearchForm>) => this.store.dispatch(
          new UpdateSaleSearchState(mapSearchFormToState(searchForm)),
        )),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private restoreFormState(state$: Observable<ISearchState>, form: FormGroup): void {
    state$
      .pipe(
        take(1),
        tap((state: ISearchState) => {
          const formValue: any = {};

          if (state.filters.city || state.filters.district) {
            formValue.cityDistrict = {
              city: state.filters.city ? state.filters.city : null,
              districts: state.filters.district ? state.filters.district : [],
            };
          }

          if (state.filters.price !== null) {
            formValue.price = { min: null, max: null };

            if (typeof state.filters.price?.min === 'number') {
              formValue.price.min = state.filters.price.min;
            }

            if (typeof state.filters.price?.max === 'number') {
              formValue.price.max = state.filters.price.max;
            }
          }

          if (state.filters['price-sqm'] !== null) {
            formValue.priceSqm = { min: null, max: null };

            if (typeof state.filters['price-sqm']?.min === 'number') {
              formValue.priceSqm.min = state.filters['price-sqm'].min;
            }

            if (typeof state.filters['price-sqm']?.max === 'number') {
              formValue.priceSqm.max = state.filters['price-sqm'].max;
            }
          }

          if (state.filters.bedrooms !== null) {
            formValue.bedrooms = { min: null, max: null };

            if (typeof state.filters.bedrooms?.min === 'number') {
              formValue.bedrooms.min = state.filters.bedrooms.min;
            }

            if (typeof state.filters.bedrooms?.max === 'number') {
              formValue.bedrooms.max = state.filters.bedrooms.max;
            }
          }

          if (state.filters.bathrooms !== null) {
            formValue.bathrooms = { min: null, max: null };

            if (typeof state.filters.bathrooms?.min === 'number') {
              formValue.bathrooms.min = state.filters.bathrooms.min;
            }

            if (typeof state.filters.bathrooms?.max === 'number') {
              formValue.bathrooms.max = state.filters.bathrooms.max;
            }
          }

          if (state.filters['property-area'] !== null) {
            formValue.propertyArea = { min: null, max: null };

            if (typeof state.filters['property-area']?.min === 'number') {
              formValue.propertyArea.min = state.filters['property-area'].min;
            }

            if (typeof state.filters['property-area']?.max === 'number') {
              formValue.propertyArea.max = state.filters['property-area'].max;
            }
          }

          form.patchValue(formValue);
        }),
        takeUntilDestroyed(this.destroyRef),
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
