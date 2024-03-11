import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { distinctUntilChanged, map, startWith, tap } from 'rxjs';

import { FormControlPipe } from '../../pipes';
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
  @Input() range!: Range<number>;

  public form: FormGroup = new FormGroup({
    min: new FormControl(),
    max: new FormControl(),
  });

  private destroyRef: DestroyRef = inject(DestroyRef);

  onChange: any = () => {};
  onTouched: any = () => {};

  public isFocused: boolean = false;

  public onFocus() {
    this.isFocused = true;
  }

  public onBlur() {
    this.isFocused = false;
  }

  public writeValue(obj: any): void {
    if (obj) {
      this.form.setValue(obj, { emitEvent: false });
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;

    this.form.valueChanges.pipe(
      map(({ min, max }) => ({
        ...(min !== null && { min }),
        ...(max !== null && { max }),
      })),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(fn);
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  public ngOnInit(): void {
    this.form.get('min')!.valueChanges
      .pipe(
        startWith(this.form.get('min')!.value),
        distinctUntilChanged(),
        tap((min: number) => this.updateMaxValidator(min)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.form.get('max')!.valueChanges
      .pipe(
        startWith(this.form.get('max')!.value),
        distinctUntilChanged(),
        tap((max: number) => this.updateMinValidator(max)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.setInitialValuesAndValidators();
  }

  private updateMaxValidator(min: number | null): void {
    const maxControl = this.form.get('max')!;

    maxControl.setValidators([
      Validators.max(this.range.max as number),
      Validators.min((min as number) ?? this.range.min),
    ]);
    maxControl.updateValueAndValidity();
  }

  private updateMinValidator(max: number | null): void {
    const minControl = this.form.get('min')!;

    minControl.setValidators([
      Validators.min(this.range.min as number),
      Validators.max((max as number) ?? this.range.max),
    ]);
    minControl.updateValueAndValidity();
  }

  private setInitialValuesAndValidators(): void {
    this.form.get('min')!.setValidators([ Validators.min(this.range.min as number), Validators.max(this.range.max as number) ]);
    this.form.get('max')!.setValidators([ Validators.min(this.range.min as number), Validators.max(this.range.max as number) ]);
    this.form.get('min')!.updateValueAndValidity({ emitEvent: false });
    this.form.get('max')!.updateValueAndValidity({ emitEvent: false });
  }
}
