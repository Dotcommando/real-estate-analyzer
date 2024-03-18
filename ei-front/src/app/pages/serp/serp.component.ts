import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngxs/store';

import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

import { BottomControlPanelComponent } from '../../components/bottom-control-panel/bottom-control-panel.component';
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
    BottomControlPanelComponent,
    MatButton,
    MatIcon,
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SerpComponent implements OnInit, AfterViewInit {
  @ViewChild(SearchFormComponent) searchFormComponent!: SearchFormComponent;

  constructor(
    private readonly store: Store,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private readonly searchService: SearchService,
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

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
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

  public onSearchButtonClick(): void {
    this.searchFormComponent.onSearchClick();
  }

  public get isSearchDisabled(): boolean {
    return !this.searchFormComponent?.isFormValid;
  }
}
