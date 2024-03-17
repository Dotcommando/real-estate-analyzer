import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store } from '@ngxs/store';

import { map, tap } from 'rxjs';

import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { SearchResultsComponent } from '../../components/search-results/search-results.component';
import { deserializeToSearchState } from '../../mappers';


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
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
  }

  public ngOnInit(): void {
    this.route.queryParamMap
      .pipe(
        map(deserializeToSearchState),
        tap((data) => {
          if (isPlatformBrowser(this.platformId)) {
            console.log('');
            console.log('Deserialized');
            console.log(data);
          }
        }),
      )
      .subscribe();
  }
}
