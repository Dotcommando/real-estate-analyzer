import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';

import { combineLatest, distinctUntilChanged, tap } from 'rxjs';

import { InputRangeComponent } from '../../components/input-range/input-range.component';


@Component({
  selector: 'app-sample',
  standalone: true,
  imports: [
    InputRangeComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './sample.component.html',
  styleUrl: './sample.component.scss',
})
export class SampleComponent implements OnInit {
  protected readonly Infinity = Infinity;

  public mockFormGroup = this.fb.group({
    mockRange: [ { min: 10, max: 50 } ],
  });

  constructor(
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    combineLatest([
      this.mockFormGroup.statusChanges,
      this.mockFormGroup.controls.mockRange.statusChanges,
    ])
      .pipe(
        distinctUntilChanged((prev, curr) => prev[0] === curr[0] && prev[1] === curr[1]),
        tap(([ formStatus, inputStatus ]) => {
          if (isPlatformBrowser(this.platformId)) {
            console.log('');
            console.log('Mock Form Status', formStatus);
            console.log('Mock Input Status', inputStatus);
            console.log(`Mock Form. Errors: ${this.mockFormGroup.errors ? JSON.stringify(this.mockFormGroup.errors).replace(/\n/g, '') : 'no errors'}`);
            console.log(`Mock Input. Errors: ${this.mockFormGroup.controls.mockRange.errors ? JSON.stringify(this.mockFormGroup.controls.mockRange.errors).replace(/\n/g, '') : 'no errors'}`);
          }
        }),
      )
      .subscribe();

    this.mockFormGroup.valueChanges
      .pipe(
        tap((value) => {
          if (isPlatformBrowser(this.platformId)) {
            console.log('');
            console.log(`External value tracking. Value: min ${value.mockRange?.min}, max ${value.mockRange?.max}`);
            console.log(`External value tracking. Errors: ${this.mockFormGroup.controls.mockRange.errors ? JSON.stringify(this.mockFormGroup.controls.mockRange.errors).replace(/\n/g, '') : 'no errors'}`);
          }
        }),
      )
      .subscribe();
  }
}
