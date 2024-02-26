import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';


@Component({
  selector: 'ei-search',
  standalone: true,
  imports: [],
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent {
  public searchForm = new FormGroup({
    type: new FormControl(),
    city: new FormControl(),
    district: new FormControl(),
  });
}
