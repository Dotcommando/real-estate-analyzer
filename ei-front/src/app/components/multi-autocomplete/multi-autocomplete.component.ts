import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { AsyncPipe } from '@angular/common';
import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption,
} from '@angular/material/autocomplete';
import { MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRow } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatLabel } from '@angular/material/select';

import { map, Observable, startWith } from 'rxjs';


export interface IOptionSet {
  value: string;
  synonyms: string[];
}

export interface IValue {
  value: string;
  name: string;
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
    MatChipInput,
    MatAutocomplete,
    MatOption,
    MatChipGrid,
    MatChipRow,
    MatFormField,
    MatLabel,
    ReactiveFormsModule,
    AsyncPipe,
    MatAutocompleteTrigger,
    MatIcon,
  ],
})
export class MultiAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() options: Array<string | IOptionSet> = [];
  public selectedItems: IValue[] = [];
  public inputControl = new FormControl<IValue | null>(null);
  public filteredOptions!: Observable<IValue[]>;
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private _onChange = (value: IValue[]) => {};
  private _onTouched = () => {};

  public ngOnInit(): void {
    this.filteredOptions = this.inputControl.valueChanges
      .pipe(
        startWith(''),
        map((input: string | IValue | null) => {
          const filterValue = typeof input === 'string' ? input : input?.name ?? '';

          return this.filterAlreadySelected(filterValue);
        }),
      );
  }

  public filterAlreadySelected(input: string | IValue | null): IValue[] {
    const filterValue = typeof input === 'string'
      ? input.toLowerCase()
      : typeof input === 'object' && input !== null
        ? input.value.toLowerCase()
        : '';

    return this.toIValue(this.options)
      .filter((option: IValue) =>
        !this.selectedItems.find(item => item.value === option.value)
          && (filterValue === '' || option.name.toLowerCase().includes(filterValue)),
      );
  }


  public toIValue(opts: Array<string | IOptionSet>): IValue[] {
    return opts.flatMap(opt =>
      typeof opt === 'string' ? [ { value: opt, name: opt } ] : opt.synonyms.map(synonym => ({ value: opt.value, name: synonym })),
    );
  }

  public add(event: MatChipInputEvent): void {
    const input = event.value.trim();

    if (!input) return;

    const valueToAdd = this.toIValue([ input ]).find(v => !this.selectedItems.map(item => item.value).includes(v.value));

    if (valueToAdd) this.selectedItems.push(valueToAdd);

    this.inputControl.setValue(null);
    this.inputElement.nativeElement.value = '';
    this._onChange(this.selectedItems);
  }

  public remove(item: IValue): void {
    const index = this.selectedItems.findIndex(selected => selected.value === item.value);

    if (index >= 0) {
      this.selectedItems.splice(index, 1);
      this._onChange(this.selectedItems);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent): void {
    const valueToAdd = event.option.value as IValue;

    if (!this.selectedItems.map(item => item.value).includes(valueToAdd.value)) {
      this.selectedItems.push(valueToAdd);
      this.inputElement.nativeElement.value = '';
      this.inputControl.setValue(null);
      this._onChange(this.selectedItems);
    }
  }

  public filter(input: IValue | null): IValue[] {
    const filterValue = (input?.name ?? '').toLowerCase();

    return this.toIValue(this.options)
      .filter((option: IValue) => option.name.toLowerCase().includes(filterValue)
        && !this.selectedItems
          .map((item: IValue): string => item.value)
          .includes(option.value),
      );
  }

  public writeValue(value: IValue[]): void {
    this.selectedItems = value ? value : [];
  }

  public registerOnChange(fn: (value: IValue[]) => void): void {
    this._onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
  }
}
