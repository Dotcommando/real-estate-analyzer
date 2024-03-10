import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
  MatOption,
} from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
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
    MatOption,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    AsyncPipe,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
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

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private _onChange = (value: IDistrictOption[]) => {};
  private _onTouched = () => {};

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
        && (filterValue === '' || option.name.toLowerCase().includes(filterValue)),
    );
  }

  public toIDistrictOption(opts: Array<string | IOptionSet>): IDistrictOption[] {
    return opts.flatMap((opt: string | IOptionSet) => typeof opt === 'string'
      ? [ { value: opt, name: opt } ]
      : opt.synonyms.map(synonym => ({ value: opt.value, name: synonym })),
    );
  }

  public add(event: MatChipInputEvent): void {
    if (this.maxSelectedItems && this.selectedItems.length >= this.maxSelectedItems) {
      return;
    }

    const input = event.value.trim();

    if (!input) return;

    const valueToAdd: IDistrictOption | undefined = this.toIDistrictOption([ input ])
      .find(v => !this.selectedItems.map(item => item.value).includes(v.value));

    if (valueToAdd) this.selectedItems.push(valueToAdd);

    this.inputControl.setValue(null);
    this.inputElement.nativeElement.value = '';
    this._onChange(this.selectedItems);
  }

  public remove(item: IDistrictOption): void {
    const index = this.selectedItems.findIndex(selected => selected.value === item.value);

    if (index >= 0) {
      this.selectedItems = [ ...this.selectedItems ];
      this.selectedItems.splice(index, 1);
      this._onChange(this.selectedItems);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    if (this.maxSelectedItems !== undefined && this.selectedItems.length >= this.maxSelectedItems) {
      this.inputElement.nativeElement.value = '';
      this.inputControl.setValue(null);

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

  public writeValue(value: IDistrictOption[]): void {
    this.selectedItems = value ? [ ...value ] : [];
  }

  public registerOnChange(fn: (value: IDistrictOption[]) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
