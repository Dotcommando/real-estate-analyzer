import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatOption,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatLabel } from '@angular/material/select';

import { map, Observable, startWith } from 'rxjs';

import { IDistrictOption } from '../../types';


export interface IOptionSet {
  value: string;
  synonyms: string[];
}

@Component({
  selector: 'ei-multi-autocomplete',
  templateUrl: './multi-autocomplete.component.html',
  styleUrls: [ './multi-autocomplete.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultiAutocompleteComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatOption,
    MatLabel,
    ReactiveFormsModule,
    AsyncPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() options: Array<string | IOptionSet> = [];
  @Input() maxSelectedItems?: number;
  public selectedItems: IDistrictOption[] = [];
  public inputControl = new FormControl<IDistrictOption | null>(null);
  public filteredOptions!: Observable<IDistrictOption[]>;
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];
  public isMaxSelectedItemsReached = false;

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private _onChange = (value: IDistrictOption[]) => {};
  private _onTouched = () => {};

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.filteredOptions = this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map((input: string | IDistrictOption | null) => {
          const filterValue = typeof input === 'string' ? input : input?.name ?? '';

          return this.filterAlreadySelected(filterValue);
        }),
      );
  }

  public filterAlreadySelected(input: string | IDistrictOption | null): IDistrictOption[] {
    const filterValue = typeof input === 'string'
      ? input.toLowerCase()
      : typeof input === 'object' && input !== null
        ? input.value.toLowerCase()
        : '';

    return this.toIDistrictOption(this.options).filter((option: IDistrictOption) =>
      !this.selectedItems.find((selected: IDistrictOption) => selected.value === option.value)
        && (filterValue === '' || option.name?.toLowerCase().includes(filterValue)),
    );
  }

  public toIDistrictOption(opts: Array<string | IOptionSet>): IDistrictOption[] {
    return opts.flatMap((opt: string | IOptionSet) => typeof opt === 'string'
      ? [ { value: opt, name: opt } ]
      : opt.synonyms.map(synonym => ({ value: opt.value, name: synonym })),
    );
  }

  private updateIsMaxSelectedItemsReached(): void {
    this.isMaxSelectedItemsReached = this.maxSelectedItems !== undefined && this.selectedItems.length >= this.maxSelectedItems;
    this.changeDetectorRef.markForCheck();
  }

  public add(event: MatChipInputEvent): void {
    this.updateIsMaxSelectedItemsReached();

    if (this.isMaxSelectedItemsReached) return;

    const input = event.value.trim();

    if (!input) return;

    const valueToAdd: IDistrictOption | undefined = this.toIDistrictOption([ input ])
      .find(v => !this.selectedItems.map(item => item.value).includes(v.value));

    if (valueToAdd) this.selectedItems.push(valueToAdd);

    this.inputControl.setValue(null);
    this.inputElement.nativeElement.value = '';
    this._onChange(this.selectedItems);
    this.changeDetectorRef.markForCheck();
  }

  public remove(item: IDistrictOption): void {
    const index = this.selectedItems.findIndex(selected => selected.value === item.value);

    if (index >= 0) {
      this.selectedItems = [ ...this.selectedItems ];
      this.selectedItems.splice(index, 1);
      this._onChange(this.selectedItems);
    }

    this.updateIsMaxSelectedItemsReached();
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    this.updateIsMaxSelectedItemsReached();

    if (this.isMaxSelectedItemsReached) {
      this.inputElement.nativeElement.value = '';
      this.inputControl.setValue(null);
      this.changeDetectorRef.markForCheck();

      return;
    }

    const valueToAdd = event.option.value as IDistrictOption;

    if (!this.selectedItems.map(item => item.value).includes(valueToAdd.value)) {
      this.selectedItems = [ ...this.selectedItems ];
      this.selectedItems.push(valueToAdd);
      this.inputElement.nativeElement.value = '';
      this.inputControl.setValue(null);
      this._onChange(this.selectedItems);
    }

    this.changeDetectorRef.markForCheck();
  }

  public filter(input: IDistrictOption | null): IDistrictOption[] {
    const filterValue = (input?.name ?? '').toLowerCase();

    return this.toIDistrictOption(this.options)
      .filter((option: IDistrictOption) => option.name.toLowerCase().includes(filterValue)
        && !this.selectedItems
          .map((item: IDistrictOption): string => item.value)
          .includes(option.value),
      );
  }

  public writeValue(value: Array<IDistrictOption | string>): void {
    if (value && Array.isArray(value)) {
      this.selectedItems = value
        ? [
          ...value
            .filter(Boolean)
            .map((district: string | IDistrictOption) => typeof district === 'string'
              ? { name: district, value: district }
              : district,
            ),
        ]
        : [];
    }
  }

  public registerOnChange(fn: (value: IDistrictOption[]) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
