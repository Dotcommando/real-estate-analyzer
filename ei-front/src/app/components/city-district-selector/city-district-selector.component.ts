import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormField } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';


@Component({
  selector: 'ei-city-district-selector',
  templateUrl: './city-district-selector.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CityDistrictSelectorComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    MatFormField,
    MatSelect,
    MatOption,
    ReactiveFormsModule,
  ],
})
export class CityDistrictSelectorComponent implements OnInit, ControlValueAccessor {
  @Input() citiesData: {
    city: string;
    districts: string[];
  }[] = [];
  @Input() optionAllText = '';

  form: FormGroup = new FormGroup({
    city: new FormControl(''),
    districts: new FormControl([]),
  });

  selectedCityDistricts: string[] = [];

  private onChange: Function = (value: any) => {};
  private onTouched: Function = () => {};

  constructor() {}

  public ngOnInit(): void {
    this.form.valueChanges.subscribe(value => {
      this.onChange(value);
    });
  }

  public writeValue(value: any): void {
    if (value) {
      this.form.setValue(value, { emitEvent: false });
      this.updateDistricts(value.city);
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  public onCityChange(city: string): void {
    this.updateDistricts(city);
    this.form.get('districts')?.reset();
  }

  private updateDistricts(city: string): void {
    const cityData = this.citiesData.find(c => c.city === city);

    this.selectedCityDistricts = cityData ? cityData.districts : [];
  }
}
