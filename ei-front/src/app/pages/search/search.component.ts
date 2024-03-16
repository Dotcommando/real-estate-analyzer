import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel, MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { Select, Store } from '@ngxs/store';

import { combineLatest, debounce, distinctUntilChanged, interval, map, Observable, take, tap } from 'rxjs';

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
import { FieldTopLabelComponent } from '../../components/field-top-label/field-top-label.component';
import { InputRangeComponent } from '../../components/input-range/input-range.component';
import { MultiAutocompleteComponent } from '../../components/multi-autocomplete/multi-autocomplete.component';
import { mapSearchFormToState, mapStateToSearchForm } from '../../mappers';


enum SearchTypeTab {
  rent,
  sale,
}

@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatCardModule,
    MatTabsModule,
    ReactiveFormsModule,
    InputRangeComponent,
    MatIconModule,
    MatSelect,
    MatLabel,
    MatFormField,
    MatOption,
    MultiAutocompleteComponent,
    CityDistrictSelectorComponent,
    MatButtonToggleGroup,
    MatButtonToggle,
    FieldTopLabelComponent,
    MatOptgroup,
    MatButton,
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
    subcategory: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),

    'priceDeviations-district_avg_mean-daily_total-medianDelta': new FormControl(),
    'priceDeviations-district_avg_mean-daily_total-meanDelta': new FormControl(),
    'priceDeviations-district_avg_mean-daily_total-medianDeltaSqm': new FormControl(),
    'priceDeviations-district_avg_mean-daily_total-meanDeltaSqm': new FormControl(),

    'priceDeviations-district_avg_mean-monthly_intermediary-medianDelta': new FormControl(),
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDelta': new FormControl(),
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDeltaSqm': new FormControl(),
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDeltaSqm': new FormControl(),

    'priceDeviations-city_avg_mean-daily_total-medianDelta': new FormControl(),
    'priceDeviations-city_avg_mean-daily_total-meanDelta': new FormControl(),
    'priceDeviations-city_avg_mean-daily_total-medianDeltaSqm': new FormControl(),
    'priceDeviations-city_avg_mean-daily_total-meanDeltaSqm': new FormControl(),

    'priceDeviations-city_avg_mean-monthly_intermediary-medianDelta': new FormControl(),
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDelta': new FormControl(),
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDeltaSqm': new FormControl(),
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDeltaSqm': new FormControl(),
  });

  public searchSaleForm = new FormGroup({
    type: new FormControl(),
    cityDistrict: new FormControl(),
    subcategory: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),

    'priceDeviations-district_avg_mean-daily_total-medianDelta': new FormControl(),
    'priceDeviations-district_avg_mean-daily_total-meanDelta': new FormControl(),
    'priceDeviations-district_avg_mean-daily_total-medianDeltaSqm': new FormControl(),
    'priceDeviations-district_avg_mean-daily_total-meanDeltaSqm': new FormControl(),

    'priceDeviations-district_avg_mean-monthly_intermediary-medianDelta': new FormControl(),
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDelta': new FormControl(),
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDeltaSqm': new FormControl(),
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDeltaSqm': new FormControl(),

    'priceDeviations-city_avg_mean-daily_total-medianDelta': new FormControl(),
    'priceDeviations-city_avg_mean-daily_total-meanDelta': new FormControl(),
    'priceDeviations-city_avg_mean-daily_total-medianDeltaSqm': new FormControl(),
    'priceDeviations-city_avg_mean-daily_total-meanDeltaSqm': new FormControl(),

    'priceDeviations-city_avg_mean-monthly_intermediary-medianDelta': new FormControl(),
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDelta': new FormControl(),
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDeltaSqm': new FormControl(),
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDeltaSqm': new FormControl(),
  });
  public currentSearchForm = this.searchRentForm;

  public rentLimits!: IRentLimits;
  public saleLimits!: ISaleLimits;

  public activeTabIndex: number = SearchTypeTab.rent;
  public maxDistrictItems = 5;

  public rentTypeFocused = false;
  public saleTypeFocused = false;

  protected readonly Infinity = Infinity;

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

    if (isPlatformBrowser(this.platformId)) {
      console.log(this.rentLimits);
      console.log(this.saleLimits);
    }

    this.restoreFormState(this.rentState$, this.searchRentForm);
    this.restoreFormState(this.saleState$, this.searchSaleForm);

    this.type$
      .pipe(
        distinctUntilChanged(),
        tap((type) => {
          console.log(type);
          this.activeTabIndex = SearchTypeTab[type];
          this.currentSearchForm = type === 'sale'
            ? this.searchSaleForm
            : this.searchRentForm;
          this.currentSearchForm.updateValueAndValidity();
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

    // this.searchRentForm.statusChanges
    //   .pipe(
    //     tap((status) => console.log('Rent Form', status)),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe();
    //
    // this.searchSaleForm.statusChanges
    //   .pipe(
    //     tap((status) => console.log('Rent Form', status)),
    //     takeUntilDestroyed(this.destroyRef),
    //   )
    //   .subscribe();
  }

  private restoreFormState(state$: Observable<ISearchState>, form: FormGroup): void {
    state$
      .pipe(
        take(1),
        map(mapStateToSearchForm),
        tap((formValue: Partial<ISearchForm>) => form.patchValue(formValue)),
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

  public onRentTypeFocus(): void {
    this.rentTypeFocused = true;
  }

  public onRentTypeBlur(): void {
    this.rentTypeFocused = false;
  }

  public onSaleTypeFocus(): void {
    this.saleTypeFocused = true;
  }

  public onSaleTypeBlur(): void {
    this.saleTypeFocused = false;
  }
}
