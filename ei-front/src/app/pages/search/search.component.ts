import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { BottomControlPanelComponent } from '../../components/bottom-control-panel/bottom-control-panel.component';
import { CookieConsentDialogComponent } from '../../components/cookie-consent-dialog/cookie-consent-dialog.component';
import { SearchFormComponent } from '../../components/search-form/search-form.component';


@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    CookieConsentDialogComponent,
    SearchFormComponent,
    MatButton,
    MatIcon,
    BottomControlPanelComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements AfterViewInit {
  @ViewChild(SearchFormComponent) searchFormComponent!: SearchFormComponent;

  constructor(
    private cdr: ChangeDetectorRef,
  ) {
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
