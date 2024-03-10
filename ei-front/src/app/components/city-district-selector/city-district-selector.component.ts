import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef, Inject,
  inject,
  Input,
  OnInit, PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { BehaviorSubject, distinctUntilChanged, map, Observable, startWith, switchMap, tap } from 'rxjs';

import { IDistrictOption, ISimpleCityDistrict } from '../../types';
import { MultiAutocompleteComponent } from '../multi-autocomplete/multi-autocomplete.component';
import { IOptionSet } from '../multi-autocomplete/multi-autocomplete.component';


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
    districts: new FormControl(null),
  });

  private districtsOptionsSubject$ = new BehaviorSubject<Array<string | IOptionSet> | null>(null);
  public districtsOptions$: Observable<Array<string | IOptionSet> | null> = this.districtsOptionsSubject$.asObservable();

  private citesDistrictsDataSubject$ = new BehaviorSubject<ISimpleCityDistrict[]>([]);
  public citesDistrictsData$ = this.citesDistrictsDataSubject$.asObservable();

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

    this.form.valueChanges
      .pipe(
        tap((value) => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public updateDistrictsOnCityChange$(): Observable<IOptionSet[]> {
    return this.form.get('city')!.valueChanges
      .pipe(
        startWith(this.form.get('city')!.value),
        distinctUntilChanged(),
        switchMap((city): Observable<IOptionSet[]> => this.citesDistrictsData$
          .pipe(
            map((citiesDistricts: ISimpleCityDistrict[]): IOptionSet[] => {
              const cityData: ISimpleCityDistrict | undefined = citiesDistricts
                .find((cityDistrict: ISimpleCityDistrict) => cityDistrict.city === city);

              if (!cityData?.districts?.length) {
                return [];
              }

              return cityData.districts
                .map((district: string): IOptionSet => ({
                  value: district,
                  synonyms: [ district ],
                }));
            }),
          ),
        ),
        tap((districtOptions: IOptionSet[]) => {
          this.districtsOptionsSubject$.next(districtOptions);
        }),
        takeUntilDestroyed(this.destroyRef),
      );
  }

  public writeValue(value: { city: string | null; districts: IDistrictOption[] | null }): void {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
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
