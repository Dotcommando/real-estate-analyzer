import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Meta, Title } from '@angular/platform-browser';

import { AbstractSeoFriendlyPageComponent } from '../../components/abstract-seo-friendly-page';
import { BottomControlPanelComponent } from '../../components/bottom-control-panel/bottom-control-panel.component';
import { SearchFormComponent } from '../../components/search-form/search-form.component';


@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    SearchFormComponent,
    MatButton,
    MatIcon,
    BottomControlPanelComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent extends AbstractSeoFriendlyPageComponent implements OnInit, AfterViewInit {
  @ViewChild(SearchFormComponent) searchFormComponent!: SearchFormComponent;

  constructor(
    meta: Meta,
    title: Title,
    private cdr: ChangeDetectorRef,
  ) {
    super(meta, title);

    this.metaTags = [
      { name: 'description', content: 'Cyprus Real Estate Search Engine, convenience filters for property search' },
      { name: 'keywords', content: 'property, real, estate, cyprus, search, Limassol, Nicosia, Larnaca, Famagusta, Paphos' },
    ];

    this.titleTagContent = 'Cyprus Real Estate Search Engine. Search for properties for rent or sale';
  }

  public ngOnInit(): void {
    this.initMeta();
  }

  public ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  public onSearchButtonClick(): void {
    this.searchFormComponent.onSearchClick();
  }

  public get isSearchDisabled(): boolean {
    return !this.searchFormComponent?.isFormValid;
  }
}
