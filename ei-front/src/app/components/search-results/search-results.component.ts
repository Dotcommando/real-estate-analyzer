import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { Select } from '@ngxs/store';

import { debounce, interval, Observable, tap } from 'rxjs';

import { SearchResultsState } from '../../store/search-results';
import { IRentResidentialId, ISaleResidentialId } from '../../types';
import { SearchResultCardComponent } from '../search-result-card/search-result-card.component';


@Component({
  selector: 'ei-search-results',
  standalone: true,
  imports: [
    SearchResultCardComponent,
    AsyncPipe,
  ],
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultsComponent implements OnInit {
  @Output() dataLoaded = new EventEmitter<void>();

  @Select(SearchResultsState.results)
  public ads$!: Observable<IRentResidentialId[] | ISaleResidentialId[] | null>;

  @Select(SearchResultsState.searchStatus)
  public searchStatus$!: Observable<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'>;

  @Select(SearchResultsState.totalResults)
  public total$!: Observable<number>;

  @Select(SearchResultsState.offset)
  public offset$!: Observable<number>;

  private destroyRef: DestroyRef = inject(DestroyRef);

  public ngOnInit(): void {
    this.ads$
      .pipe(
        debounce(() => interval(50)),
        tap(() => this.dataLoaded.next()),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
