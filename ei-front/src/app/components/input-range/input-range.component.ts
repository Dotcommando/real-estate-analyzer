import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  forwardRef,
  Inject,
  inject,
  Input,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { distinctUntilChanged, tap } from 'rxjs';

import { FormatNumberPipe, FormControlPipe } from '../../pipes';
import { Range } from '../../types';
import { FieldTopLabelComponent } from '../field-top-label/field-top-label.component';


@Component({
  selector: 'ei-input-range',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    FormControlPipe,
    FieldTopLabelComponent,
    FormatNumberPipe,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRangeComponent),
      multi: true,
    },
  ],
  templateUrl: './input-range.component.html',
  styleUrl: './input-range.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRangeComponent implements OnInit {
  @Input() label: string = '';

  private _range = { min: Number.MIN_SAFE_INTEGER, max: Number.MAX_SAFE_INTEGER };
  @Input()
  set range(value: Range<number>) {
    const min = this.isValidNumber(value?.min)
      ? value.min as number
      : Number.MIN_SAFE_INTEGER;
    const max = this.isValidNumber(value?.max)
      ? value.max as number
      : Number.MAX_SAFE_INTEGER;

    this._range.min = min;
    this._range.max = max;
  };
  get range(): Required<Range<number>> {
    return this._range;
  }

  protected readonly Infinity = Number.MAX_SAFE_INTEGER;
  protected readonly MinusInfinity = Number.MIN_SAFE_INTEGER;

  public form: FormGroup = this.fb.group({
    min: new FormControl(),
    max: new FormControl(),
  });

  private destroyRef: DestroyRef = inject(DestroyRef);

  onChange: any = () => {};
  onTouched: any = () => {};

  public isFocused: boolean = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public onFocus() {
    this.isFocused = true;
  }

  public onBlur() {
    this.isFocused = false;
  }

  public writeValue(obj: any): void {
    if (obj) {
      this.form.setValue({
        min: obj?.min ? obj.min : null,
        max: obj?.max ? obj.max : null,
      }, { emitEvent: true });
    }
  }

  public registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  public validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  public ngOnInit(): void {
    this.form.valueChanges
      .pipe(
        distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
        tap((value: Required<Range<number>>) => this.onChange(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  private isValidNumber(value: unknown): boolean {
    if (typeof value !== 'number') {
      return false;
    }

    return !(isNaN(value) || value === Infinity || value === -Infinity);
  }
}
