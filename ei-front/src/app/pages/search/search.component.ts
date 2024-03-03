import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { Select, Store } from '@ngxs/store';

import { distinctUntilChanged, Observable, tap } from 'rxjs';

import { ChangeType, SearchTypeState } from './search.store';


enum SearchTypeTab {
  rent,
  sale,
}

@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    MatTabsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  @Select(SearchTypeState.searchType) type$!: Observable<'rent' | 'sale'>;

  public searchForm = new FormGroup({
    type: new FormControl(),
    city: new FormControl(),
    district: new FormControl(),
  });

  public activeTabIndex: number = SearchTypeTab.rent;

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store,
  ) {
  }

  public ngOnInit(): void {
    this.type$
      .pipe(
        distinctUntilChanged(),
        tap(((data) => console.log(data))),
        tap((type) => {
          this.activeTabIndex = SearchTypeTab[type];
        }),
        tap((value: 'rent' | 'sale') => this.searchForm.controls.type.setValue(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onTabIndexChange(index: number): void {
    const type = index === 0 ? 'rent' : 'sale';

    this.store.dispatch(new ChangeType(type));
  }
}
