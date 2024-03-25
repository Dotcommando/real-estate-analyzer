import { AsyncPipe, isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Inject,
  inject,
  OnInit,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Select, Store } from '@ngxs/store';

import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  tap,
  timeout,
} from 'rxjs';

import { environment } from '../../../environments/environment';
import { BottomControlPanelComponent } from '../../components/bottom-control-panel/bottom-control-panel.component';
import { ErrorSnackBarComponent } from '../../components/error-snack-bar/error-snack-bar.component';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchService } from '../../components/search-results/search.service';
import { SearchResultsComponent } from '../../components/search-results/search-results.component';
import { deserializeToSearchState, serializeToSearchQuery } from '../../mappers';
import { ISearchState, UpdateRentSearchState, UpdateSaleSearchState } from '../../store/search-form';
import {
  ChangeOffsetLimit,
  FetchSearchResults,
  FetchSearchResultsFail,
  FetchSearchResultsSuccess,
  SearchResultsState,
} from '../../store/search-results';
import { IRentResidentialId, IResponse, ISaleResidentialId } from '../../types';


@Component({
  selector: 'ei-serp',
  standalone: true,
  imports: [
    MatPaginatorModule,
    SearchFormComponent,
    SearchResultsComponent,
    BottomControlPanelComponent,
    MatButton,
    MatIcon,
    AsyncPipe,
    MatProgressSpinner,
  ],
  templateUrl: './serp.component.html',
  styleUrl: './serp.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SerpComponent implements OnInit, AfterViewInit {
  @ViewChild(SearchFormComponent) searchFormComponent!: SearchFormComponent;
  @Select(SearchResultsState.searchStatus) searchStatus!: Observable<'IDLE' | 'PENDING' | 'SUCCESS' | 'FAILED'>;
  @Select(SearchResultsState.totalResults) totalResults!: Observable<number>;
  @Select(SearchResultsState.offset) offset!: Observable<number>;
  @Select(SearchResultsState.limit) limit!: Observable<number>;

  public pageIndex = 0;
  public pageSizeOptions = [ 10, 15, 20, 25 ];
  public origin = environment.origin;

  private errorSnackBarDurationInSeconds = 15;
  private router: Router = inject(Router);
  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private readonly searchService: SearchService,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map((paramMap: ParamMap): [ ParamMap, ISearchState ] => [ paramMap, deserializeToSearchState(paramMap) ]),
        tap(([ paramMap, searchState ]: [ ParamMap, ISearchState ]) => this.store.dispatch(searchState.filters.type === 'rent'
          ? new UpdateRentSearchState(searchState)
          : new UpdateSaleSearchState(searchState),
        )),
        switchMap(([ paramMap, searchState ]: [ ParamMap, ISearchState ]): Observable<[ ParamMap, ISearchState, string ]> => combineLatest([
          this.offset,
          this.limit,
        ])
          .pipe(
            tap(([ offset, limit ]: [ number, number ]) => {
              this.pageIndex = Math.floor(offset / limit);
            }),
            map(([ offset, limit ]: [ number, number ]): [ ParamMap, ISearchState, string ] => {
              return [ paramMap, searchState, serializeToSearchQuery(searchState, offset, limit) ];
            }),
          ),
        ),
        distinctUntilChanged(([ , , oldQueryString ], [ , , currQueryString ]) => oldQueryString === currQueryString),
        tap(([ , , queryString ]: [ ParamMap, ISearchState, string ]) => {
          if (isPlatformBrowser(this.platformId)) {
            if (queryString !== window.location.search) {
              const targetUrl = '/search-results' + queryString;

              console.log('');
              console.warn('Processed query string does not match with the original.');
              console.warn('Original:  ', window.location.search);
              console.warn('Processed: ', queryString);
              console.warn('Redirected to ', targetUrl);

              this.router.navigateByUrl(targetUrl);
            }
          }
        }),
        switchMap(([ , , queryString ]: [ ParamMap, ISearchState, string ]) => this.performSearch(queryString)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public scrollToResults(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  public performSearch(queryString: string): Observable<IResponse<{
    result: IRentResidentialId[] | ISaleResidentialId[];
    total: number;
  }>> {
    return this.store.dispatch(new FetchSearchResults({ query: queryString }))
      .pipe(
        switchMap(() => this.searchService.search(queryString)
          .pipe(
            timeout(environment.mainRequestTimeoutMs),
          ),
        ),
        tap((response) => {
          this.store.dispatch(new FetchSearchResultsSuccess({
            result: response.data?.result ?? [],
            total: response.data?.total ?? 0,
          }));
        }),
        catchError((error) => {
          if (isPlatformBrowser(this.platformId)) {
            this.store.dispatch(new FetchSearchResultsFail(error));
            this.openErrorSnackBar(error);
            this.searchFormComponent.currentSearchForm.markAsDirty();
            this.searchFormComponent.currentSearchForm.markAsTouched();
          }

          return of(error);
        }),
      );
  }

  public onSearchButtonClick(): void {
    this.searchFormComponent.onSearchClick();
  }

  public get isSearchDisabled(): boolean {
    return this.searchFormComponent?.currentSearchForm.pristine || !this.searchFormComponent?.isFormValid;
  }

  public handlePageEvent(e: PageEvent): void {
    const offset = e.pageIndex * e.pageSize;
    const limit = e.pageSize;

    this.store.dispatch(new ChangeOffsetLimit({ offset, limit }));
  }

  public openErrorSnackBar(error: HttpErrorResponse): void {
    this.snackBar
      .openFromComponent(ErrorSnackBarComponent, {
        duration: this.errorSnackBarDurationInSeconds * 1000,
        data: {
          ...(error.status && { status: error.status }),
          message: error.message,
        },
      });
  }
}
