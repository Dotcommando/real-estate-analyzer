import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngxs/store';

import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import { ISearchState } from '../../components/search-form/search.model';
import { UpdateRentSearchState, UpdateSaleSearchState } from '../../components/search-form/search.store';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchService } from '../../components/search-results/search.service';
import { SearchResultsComponent } from '../../components/search-results/search-results.component';
import {
  FetchSearchResults,
  FetchSearchResultsFail,
  FetchSearchResultsSuccess,
} from '../../components/search-results/search-results.store';
import { deserializeToSearchState, serializeToSearchQuery } from '../../mappers';
import { IRentResidentialId, IResponse, ISaleResidentialId } from '../../types';


@Component({
  selector: 'ei-serp',
  standalone: true,
  imports: [
    SearchFormComponent,
    SearchResultsComponent,
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.scss',
})
export class SerpComponent implements OnInit {
  constructor(
    private readonly store: Store,
    private readonly searchService: SearchService,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map(deserializeToSearchState),
        tap((searchState: ISearchState) => {
          if (isPlatformBrowser(this.platformId)) {
            console.log('');
            console.log('Deserialized');
            console.log(searchState);
          }

          this.store.dispatch(searchState.filters.type === 'rent'
            ? new UpdateRentSearchState(searchState)
            : new UpdateSaleSearchState(searchState),
          );
        }),
        map(serializeToSearchQuery),
        switchMap((queryString: string) => this.performSearch(queryString)
          .pipe(
            tap((response) => {
              if (isPlatformBrowser(this.platformId)) {
                console.log('');
                console.log('Response');
                console.log(response);
              }
            }),
          ),
        ),
      )
      .subscribe();
  }

  public performSearch(queryString: string): Observable<IResponse<{
    result: IRentResidentialId[] | ISaleResidentialId[];
    total: number;
  }>> {
    return this.store.dispatch(new FetchSearchResults({ query: queryString }))
      .pipe(
        switchMap(() => this.searchService.search(queryString)),
        tap((response) => {
          this.store.dispatch(new FetchSearchResultsSuccess({
            result: response.data?.result ?? [],
            total: response.data?.total ?? 0,
          }));
        }),
        catchError(error => {
          this.store.dispatch(new FetchSearchResultsFail(error));

          return of(error);
        }),
      );
  }
}
