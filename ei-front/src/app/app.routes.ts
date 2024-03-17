import { Routes } from '@angular/router';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';


export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'search-results', component: SearchResultsComponent },
  { path: '**', component: NotFoundComponent },
];
