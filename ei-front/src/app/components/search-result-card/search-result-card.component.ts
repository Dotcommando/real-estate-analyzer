import { DatePipe, NgClass, SlicePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatAnchor } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDivider } from '@angular/material/divider';

import { IRentResidentialId, ISaleResidentialId } from '../../types';


@Component({
  selector: 'app-search-result-card',
  standalone: true,
  imports: [
    MatChipsModule,
    MatCardModule,
    MatAnchor,
    SlicePipe,
    MatDivider,
    NgClass,
    DatePipe,
  ],
  templateUrl: './search-result-card.component.html',
  styleUrl: './search-result-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultCardComponent {
  @Input() adData!: IRentResidentialId | ISaleResidentialId;
  @Input() orderNumber!: number;
}
