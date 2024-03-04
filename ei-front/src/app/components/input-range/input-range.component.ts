import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { startWith, tap } from 'rxjs';

import { FormControlPipe } from '../../pipes';
import { Range } from '../../types';


@Component({
  selector: 'ei-input-range',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    FormControlPipe,
  ],
  templateUrl: './input-range.component.html',
  styleUrl: './input-range.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputRangeComponent implements OnInit {
  @Input() label: string = '';
  @Input() range!: Range<number>;
  @Output() rangeChange = new EventEmitter<Range<number>>();

  public form: FormGroup = new FormGroup({
    min: new FormControl(),
    max: new FormControl(),
  });

  private destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.form.get('min')!.valueChanges
      .pipe(
        startWith(this.form.get('min')!.value),
        tap((min: number) => {
          this.updateMaxValidator(min);
          this.emitRangeChange();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.form.get('max')!.valueChanges
      .pipe(
        startWith(this.form.get('max')!.value),
        tap((max: number) => {
          this.updateMinValidator(max);
          this.emitRangeChange();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();

    this.setInitialValuesAndValidators();
  }

  private updateMaxValidator(min: number | null): void {
    const maxControl = this.form.get('max')!;

    maxControl.setValidators([
      Validators.required,
      Validators.max(this.range.max as number),
      Validators.min((min as number) ?? this.range.min),
    ]);
    maxControl.updateValueAndValidity();
  }

  private updateMinValidator(max: number | null): void {
    const minControl = this.form.get('min')!;

    minControl.setValidators([
      Validators.required,
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

  private emitRangeChange(): void {
    const min = this.form.get('min')!.value;
    const max = this.form.get('max')!.value;

    this.rangeChange.emit({ min, max });
  }
}
