import { Routes } from '@angular/router';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { SerpComponent } from './pages/serp/serp.component';


export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'search-results', component: SerpComponent },
  { path: '**', component: NotFoundComponent },
];
