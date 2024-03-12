import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  forwardRef,
  Inject,
  inject,
  Input, NgZone,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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

import { BehaviorSubject, filter, tap } from 'rxjs';

import { toIDistrictOption } from '../../mappers';
import { IDistrictOption, IOptionSet } from '../../types';


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
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MultiAutocompleteComponent implements ControlValueAccessor, OnInit {
  @Input() label = '';
  @Input() placeholder = 'Select...';
  @Input() maxSelectedItems?: number;
  private _options: Array<string | IOptionSet> = [];
  @Input()
  set options(options: Array<string | IOptionSet>) {
    this._options = options;
    this.autocompleteOptions = this.filterOptions(toIDistrictOption(options), this.selectedItems);
    this.cdr.markForCheck();
  };
  get options(): Array<string | IOptionSet> {
    return this._options;
  }
  @Output() focus = new EventEmitter<void>();
  @Output() blur = new EventEmitter<void>();
  public selectedItems: IDistrictOption[] = [];
  public inputControl: FormControl<string | null> = new FormControl<string | null>('');
  public autocompleteOptions!: IDistrictOption[];
  public separatorKeysCodes: number[] = [ ENTER, COMMA ];
  public isMaxSelectedItemsReached = false;
  public focused = false;
  public inputInnerText = this.placeholder;

  @ViewChild('inputElement') inputElement!: ElementRef<HTMLInputElement>;

  private _onChange = (value: IDistrictOption[]) => {};
  private _onTouched = () => {};
  private blurTimeout!: ReturnType<typeof setTimeout>;
  private focusedSubject$ = new BehaviorSubject(false);
  public focused$ = this.focusedSubject$.asObservable();
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    this.postponedBlur = this.postponedBlur.bind(this);
    this.removeFocus = this.removeFocus.bind(this);
  }

  public ngOnInit(): void {
    this.inputControl.valueChanges
      .pipe(
        // @ts-ignore
        filter((userInput: string | null) => typeof userInput === 'string'),
        tap((userInput: string) => {
          this.autocompleteOptions = this.filterOptions(toIDistrictOption(this.options), this.selectedItems, userInput);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.focused$
      .pipe(
        tap((focused) => {
          if (focused) {
            this.inputInnerText = this.placeholder;
          } else if (this.selectedItems.length) {
            this.inputInnerText = 'Chosen: ' + this.selectedItems.length;
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private filterOptions(options: IDistrictOption[], selectedItems: IDistrictOption[], userInput = ''): IDistrictOption[] {
    const selectedItemsValues = selectedItems.map((selectedItem: IDistrictOption) => selectedItem.value.toLowerCase());

    return userInput
      ? options
        .filter((option: IDistrictOption) => option.name?.toLowerCase().startsWith(userInput.toLowerCase()))
        .filter((option: IDistrictOption) => !selectedItemsValues.includes(option.value?.toLowerCase()))
      : options
        .filter((option: IDistrictOption) => !selectedItemsValues.includes(option.value?.toLowerCase()));
  }

  public filterOptionsOnFocus(): void {
    this.autocompleteOptions = this.filterOptions(toIDistrictOption(this.options), this.selectedItems, this.inputControl.value ?? '');

    this.cdr.markForCheck();
  }

  private updateIsMaxSelectedItemsReached(): void {
    this.isMaxSelectedItemsReached = this.maxSelectedItems !== undefined && this.selectedItems.length >= this.maxSelectedItems;
    this.cdr.markForCheck();
  }

  public add(event: MatChipInputEvent): void {
    this.updateIsMaxSelectedItemsReached();

    if (this.isMaxSelectedItemsReached) return;

    const input = event.value.trim();

    if (!input) return;

    const valueToAdd: IDistrictOption | undefined = toIDistrictOption([ input ])
      .find(v => !this.selectedItems.map(item => item.value).includes(v.value));

    if (valueToAdd) this.selectedItems.push(valueToAdd);

    this.inputControl.setValue(null);
    this.inputElement.nativeElement.value = '';
    this._onChange(this.selectedItems);
    this.cdr.markForCheck();
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
      this.cdr.markForCheck();

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

    this.cdr.markForCheck();
  }

  public filter(input: IDistrictOption | null): IDistrictOption[] {
    const filterValue = (input?.name ?? '').toLowerCase();

    return toIDistrictOption(this.options)
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

  public onInputFocus(): void {
    clearTimeout(this.blurTimeout);
    this.focused = true;
    this.focusedSubject$.next(true);
    this.filterOptionsOnFocus();
    this.focus.emit();
    this._onTouched();
  }

  private removeFocus(): void {
    this.focused = false;
    this.focusedSubject$.next(false);
    this.cdr.detectChanges();
  }

  private postponedBlur() {
    this.zone.run(this.removeFocus);
  }

  public onInputBlur(): void {
    this.blurTimeout = setTimeout(this.postponedBlur, 100);

    this.blur.emit();
    this._onTouched();
  }
}
