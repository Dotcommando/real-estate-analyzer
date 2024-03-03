import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';

import { Select, Store } from '@ngxs/store';

import { Observable, tap } from 'rxjs';

import { SearchState, UpdateSearchState } from './search.store';


@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    MatTabsModule,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  @Select(SearchState.searchType) type$!: Observable<'rent' | 'sale'>;

  public searchForm = new FormGroup({
    type: new FormControl(),
    city: new FormControl(),
    district: new FormControl(),
  });

  private destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly store: Store,
  ) {
  }

  public ngOnInit(): void {
    this.type$
      .pipe(
        tap(((data) => console.log(data))),
        tap((value: 'rent' | 'sale') => this.searchForm.controls.type.setValue(value)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public onTabIndexChange(index: number): void {
    const type = index === 0 ? 'rent' : 'sale';

    this.store.dispatch(new UpdateSearchState({ filters: { type }}));
  }
}
