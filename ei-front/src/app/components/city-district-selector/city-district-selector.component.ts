import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  Inject,
  inject,
  Input,
  OnInit, PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  tap,
} from 'rxjs';

import { toIDistrictOption } from '../../mappers';
import { IDistrictOption, IOptionSet, ISimpleCityDistrict } from '../../types';
import { MultiAutocompleteComponent } from '../multi-autocomplete/multi-autocomplete.component';


function compareDistrictOptions(prev: IDistrictOption[], curr: IDistrictOption[]): boolean {
  if ((!prev && curr) || (prev && !curr)) return false;
  if (!prev && !curr) return true;
  if (prev?.length !== curr?.length) return false;

  return prev.every((prevItem: IDistrictOption, index: number) => {
    const currItem: IDistrictOption = curr[index];

    return prevItem.value === currItem.value && prevItem.name === currItem.name;
  });
}

function compareCities(prev: string, curr: string): boolean {
  return prev === curr;
}

function compareCityDistrictData(prev: ISimpleCityDistrict[], curr: ISimpleCityDistrict[]): boolean {
  if ((!prev && curr) || (prev && !curr)) return false;
  if (!prev && !curr) return true;
  if (prev?.length !== curr?.length) return false;

  return prev.every((prevCity: ISimpleCityDistrict, index: number) => {
    const currCity = curr[index];

    return prevCity.city === currCity.city
      && prevCity.districts.length === currCity.districts.length
      && prevCity.districts.every((district: string, districtIndex: number) => district === currCity.districts[districtIndex]);
  });
}

@Component({
  selector: 'ei-city-district-selector',
  templateUrl: './city-district-selector.component.html',
  styleUrls: [ './city-district-selector.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityDistrictSelectorComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MultiAutocompleteComponent,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CityDistrictSelectorComponent implements ControlValueAccessor, OnInit {
  form: FormGroup = new FormGroup({
    city: new FormControl(null),
    districts: new FormControl([]),
  });

  private districtsOptionsSubject$ = new BehaviorSubject<Array<string | IOptionSet>>([]);
  public districtsOptions$: Observable<Array<string | IOptionSet> | null> = this.districtsOptionsSubject$.asObservable();

  private citesDistrictsDataSubject$ = new BehaviorSubject<ISimpleCityDistrict[]>([]);
  public citesDistrictsData$: Observable<ISimpleCityDistrict[]> = this.citesDistrictsDataSubject$.asObservable();

  private destroyRef: DestroyRef = inject(DestroyRef);

  @Input() maxDistrictItems = 5;

  @Input()
  set citiesDistrictsData(value: ISimpleCityDistrict[]) {
    this.citesDistrictsDataSubject$.next(value ?? []);
  }
  get citiesDistrictsData(): ISimpleCityDistrict[] {
    return this.citesDistrictsDataSubject$.getValue();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.updateDistrictsOnCityChange$()
      .subscribe();
  }

  public updateDistrictsOnCityChange$(): Observable<[ string, IDistrictOption[], IOptionSet[], ISimpleCityDistrict[] ]> {
    return combineLatest([
      this.form.get('city')!.valueChanges
        .pipe(
          distinctUntilChanged(compareCities),
        ),
      this.form.get('districts')!.valueChanges
        .pipe(
          distinctUntilChanged(compareDistrictOptions),
        ),
      this.citesDistrictsData$
        .pipe(
          distinctUntilChanged(compareCityDistrictData),
        ),
    ]).pipe(
      filter(([ city ]) => Boolean(city)),
      map(([ city, districts, simpleCityDistricts ]: [ string, IDistrictOption[], ISimpleCityDistrict[] ]): [ string, IDistrictOption[], IOptionSet[], ISimpleCityDistrict[] ] => {
        const defaultResult: [ string, IDistrictOption[], IOptionSet[], ISimpleCityDistrict[] ] = [
          city,
          districts,
          [],
          simpleCityDistricts,
        ];

        if (!city || !simpleCityDistricts?.length) {
          return defaultResult;
        }

        const foundCityDistrict: ISimpleCityDistrict | undefined = simpleCityDistricts.find((cd: ISimpleCityDistrict) => cd.city === city);

        if (!foundCityDistrict) {
          return defaultResult;
        }

        const districtOptions: IOptionSet[] = foundCityDistrict.districts.map((d: string) => ({
          value: d,
          synonyms: [ d ],
        }));

        return [
          city,
          districts,
          districtOptions,
          simpleCityDistricts,
        ];
      }),
      tap(([ , , districtOptions ]) => this.districtsOptionsSubject$.next(districtOptions)),
      map(([ city, districts, districtOptions, simpleCityDistricts ]): [ string, IDistrictOption[], IOptionSet[], ISimpleCityDistrict[] ] => {
        const defaultResult: [ string, IDistrictOption[], IOptionSet[], ISimpleCityDistrict[] ] = [
          city,
          districts,
          districtOptions,
          simpleCityDistricts,
        ];

        if (!city || !districts?.length) {
          return defaultResult;
        }

        const filteredDistricts: IDistrictOption[] = districts
          .filter((districtOption: IDistrictOption) => districtOptions.some((option: IOptionSet) => districtOption.value === option.value));

        return filteredDistricts.length === districts.length
          ? defaultResult
          : [
            city,
            filteredDistricts,
            districtOptions,
            simpleCityDistricts,
          ];
      }),
      tap(([ city, districts ]) => {
        this.form.controls['districts'].setValue(districts);
        this.onChange({ city, districts });
        this.cdr.markForCheck();
      }),
      takeUntilDestroyed(this.destroyRef),
    );
  }

  public writeValue(value: { city: string | null; districts: string[] | null }): void {
    if (value?.city) {
      this.form.controls['city'].setValue(value.city, { emitEvent: false });
    }

    if (Array.isArray(value?.districts) && value.districts.length) {
      this.form.controls['districts'].setValue(toIDistrictOption(value.districts));
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  private onChange: any = () => {};
  private onTouch: any = () => {};
}
