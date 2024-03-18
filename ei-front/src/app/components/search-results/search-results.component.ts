import { AsyncPipe } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';

import { Select, Store } from '@ngxs/store';

import { Observable, tap } from 'rxjs';

import { SearchResultsState } from './search-results.store';

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
})
export class SearchResultsComponent implements OnInit {
  @Select(SearchResultsState.results)
  public ads$!: Observable<IRentResidentialId[] | ISaleResidentialId[] | null>;

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store,
  ) {
  }

  public ngOnInit(): void {
    this.ads$
      .pipe(
        tap((data) => {
          console.log('RESULT');
          console.log(data);
        }),
      )
      .subscribe();
  }
}
