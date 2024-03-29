import { SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_SNACK_BAR_DATA,
  MatSnackBarAction,
  MatSnackBarActions,
  MatSnackBarLabel,
  MatSnackBarRef,
} from '@angular/material/snack-bar';


@Component({
  selector: 'ei-error-snack-bar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
    MatSnackBarAction,
    SlicePipe,
  ],
  templateUrl: './error-snack-bar.component.html',
  styleUrl: './error-snack-bar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorSnackBarComponent {
  public snackBarRef = inject(MatSnackBarRef);

  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string; status?: string | number },
  ) {
  }
}
