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
import { InputRangeComponent } from '../../components/input-range/input-range.component';
import { MultiAutocompleteComponent } from '../../components/multi-autocomplete/multi-autocomplete.component';
import { mapSearchFormToState } from '../../mappers';
import { IDistrictOption } from '../../types';


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
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Select(SearchTypeState.searchType) type$!: Observable<'rent' | 'sale'>;

  public initialDistricts: IDistrictOption[] = [
    { value: 'Eledio', name: 'Eledio' },
    { value: 'Tala', name: 'Tala' },
  ];

  public searchRentForm = new FormGroup({
    type: new FormControl(),
    city: new FormControl(),
    district: new FormControl(this.initialDistricts),
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
  public selectedCityDistricts: string[] | null = null;

  private destroyRef: DestroyRef = inject(DestroyRef);

  public districtsExample = [
    'Eledio',
    'Tala',
    'Koili',
    'Choulou',
    'Arodes Pano',
    'Pegeia',
    'Giolou',
    {
      value: 'Agia Marina Chrysochous',
      synonyms: [
        'Ag. Marina Chrysochous',
        'Agia Marina Chrysochous',
        'Marina Agia Chrysochous',
        'Chrysochous Marina Agia ',
      ],
    },
    'Koloni',
    'Kouklia Pafou',
  ];

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

    this.searchRentForm.controls.district
      .valueChanges
      .pipe(
        tap((data) => console.log(data)),
      )
      .subscribe();
  }

  public onCityChange(city: string, type: 'rent' | 'sale'): void {
    if (city === 'all') {
      this.selectedCityDistricts = null;
      this.searchRentForm.controls.district.disable();
    } else {
      const cityData = this.rentLimits.cities.find(c => c.city === city);

      this.selectedCityDistricts = cityData ? cityData.districts : null;
      this.searchRentForm.controls.district.enable();
      this.searchRentForm.controls.district.reset();
    }
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
