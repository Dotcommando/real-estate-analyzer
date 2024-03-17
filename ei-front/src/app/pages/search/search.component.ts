import { Component } from '@angular/core';

import { SearchFormComponent } from '../../components/search-form/search-form.component';


@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [
    SearchFormComponent,
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {

}
