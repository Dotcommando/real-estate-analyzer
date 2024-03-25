import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  inject,
  NgZone,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormField, MatLabel, MatOptgroup, MatOption, MatSelect } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { Router } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import { debounce, distinctUntilChanged, interval, map, Observable, switchMap, take, tap } from 'rxjs';

import { LimitationsService } from './limitations.service';

import { IRentLimits, ISaleLimits } from '../../../../bff/types';
import { mapSearchFormToState, mapStateToSearchForm, serializeToSearchQuery } from '../../mappers';
import {
  ChangeType,
  ISearchForm,
  ISearchState,
  SearchRentState,
  SearchSaleState,
  SearchTypeState,
  UpdateRentSearchState,
  UpdateSaleSearchState,
} from '../../store/search-form';
import { ChangeOffsetLimit, SearchResultsState } from '../../store/search-results';
import { Range } from '../../types';
import { CityDistrictSelectorComponent } from '../city-district-selector/city-district-selector.component';
import { FieldTopLabelComponent } from '../field-top-label/field-top-label.component';
import { InputRangeComponent } from '../input-range/input-range.component';
import { MultiAutocompleteComponent } from '../multi-autocomplete/multi-autocomplete.component';


enum SearchTypeTab {
  rent,
  sale,
}

@Component({
  selector: 'ei-search-form',
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
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
})
export class SearchFormComponent implements OnInit, AfterViewInit {
  @Select(SearchTypeState.searchType) type$!: Observable<'rent' | 'sale'>;
  @Select(SearchRentState) rentState$!: Observable<ISearchState>;
  @Select(SearchSaleState) saleState$!: Observable<ISearchState>;
  @Select(SearchResultsState.limit) limit$!: Observable<number>;

  public availableRange = { min: 0, max: Infinity };

  public searchRentForm = this.fb.group({
    type: new FormControl(),
    cityDistrict: new FormControl(),
    subcategory: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),

    'priceDeviations-district_avg_mean-daily_total-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-daily_total-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-daily_total-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-daily_total-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],

    'priceDeviations-district_avg_mean-monthly_intermediary-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],

    'priceDeviations-city_avg_mean-daily_total-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-daily_total-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-daily_total-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-daily_total-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],

    'priceDeviations-city_avg_mean-monthly_intermediary-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
  });

  public searchSaleForm = this.fb.group({
    type: new FormControl(),
    cityDistrict: new FormControl(),
    subcategory: new FormControl(),
    price: new FormControl(),
    priceSqm: new FormControl(),
    bedrooms: new FormControl(),
    bathrooms: new FormControl(),
    propertyArea: new FormControl(),

    'priceDeviations-district_avg_mean-daily_total-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-daily_total-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-daily_total-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-daily_total-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],

    'priceDeviations-district_avg_mean-monthly_intermediary-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-monthly_intermediary-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-district_avg_mean-monthly_intermediary-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],

    'priceDeviations-city_avg_mean-daily_total-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-daily_total-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-daily_total-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-daily_total-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],

    'priceDeviations-city_avg_mean-monthly_intermediary-medianDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDelta': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-monthly_intermediary-medianDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
    'priceDeviations-city_avg_mean-monthly_intermediary-meanDeltaSqm': [ { min: null, max: null }, [ this.rangeValidator(this.availableRange) ] ],
  });
  public currentSearchForm = this.searchRentForm;

  public rentLimits!: IRentLimits;
  public saleLimits!: ISaleLimits;

  public activeTabIndex: number = SearchTypeTab.rent;
  public maxDistrictItems = 5;

  public rentTypeFocused = false;
  public saleTypeFocused = false;

  protected readonly Infinity = Infinity;

  private limit = 10;
  private currentType: 'rent' | 'sale' = 'rent';
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  private activeFormState$: Observable<ISearchState> = this.type$
    .pipe(
      switchMap((type: 'rent' | 'sale'): Observable<ISearchState> => type === 'sale' ? this.saleState$ : this.rentState$),
      takeUntilDestroyed(this.destroyRef),
    );

  constructor(
    private fb: FormBuilder,
    private zone: NgZone,
    private readonly store: Store,
    private cdr: ChangeDetectorRef,
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

    this.limit$
      .pipe(
        tap((limit: number) => this.limit = limit),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.type$
      .pipe(
        distinctUntilChanged(),
        tap((type) => {
          this.activeTabIndex = SearchTypeTab[type];
          this.currentSearchForm = type === 'sale'
            ? this.searchSaleForm
            : this.searchRentForm;
          this.currentSearchForm.updateValueAndValidity();
          this.currentType = type;
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.trackSearchForm$(this.searchRentForm.valueChanges as Observable<Partial<ISearchForm>>)
      .pipe(
        map(mapSearchFormToState),
        tap((searchForm: Partial<ISearchState>) => this.store.dispatch(
          new UpdateRentSearchState(searchForm),
        )),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.trackSearchForm$(this.searchSaleForm.valueChanges as Observable<Partial<ISearchForm>>)
      .pipe(
        map(mapSearchFormToState),
        tap((searchForm: Partial<ISearchState>) => this.store.dispatch(
          new UpdateSaleSearchState(searchForm),
        )),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId) && this.currentType === 'sale') {
      const currentTab = this.currentType;

      if (currentTab === 'sale') {
        this.zone.runOutsideAngular(() => {
          setTimeout(() => {
            this.zone.run(() => {
              this.switchToRentAndBackToSale();
            });
          }, 0);
        });
      }
    }
  }

  private switchToRentAndBackToSale(): void {
    this.onTabIndexChange(SearchTypeTab.rent);

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.onTabIndexChange(SearchTypeTab.sale);
      }, 10);
    });
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

  private rangeValidator(range: Required<Range<number>>): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const min = group?.value?.min ?? null;
      const max = group?.value?.max ?? null;

      if (min === null && max === null) {
        return null;
      }

      if (typeof min === 'number' && (max === null)) {
        return min >= range.min && min <= range.max
          ? null
          : { rangeInvalid: true };
      }

      if (typeof max === 'number' && (min === null)) {
        return max >= range.min && max <= range.max
          ? null
          : { rangeInvalid: true };
      }

      return min <= max && min >= range.min && max <= range.max
        ? null
        : { rangeInvalid: true };
    };
  };

  public onSearchClick(): void {
    this.currentSearchForm.markAsPristine();
    this.currentSearchForm.markAsUntouched();
    this.activeFormState$
      .pipe(
        take(1),
        map((data: ISearchState) => serializeToSearchQuery(data, 0, this.limit)),
        tap(() => this.store.dispatch(new ChangeOffsetLimit({ offset: 0 }))),
        tap((queryString: string) => this.router.navigateByUrl(`/search-results${queryString}`)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public get isFormValid(): boolean {
    return this.currentSearchForm.valid;
  }
}
