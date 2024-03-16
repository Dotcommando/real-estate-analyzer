import { Routes } from '@angular/router';

import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SampleComponent } from './pages/sample/sample.component';
import { SearchComponent } from './pages/search/search.component';


export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'sample', component: SampleComponent },
  { path: '**', component: NotFoundComponent },
];
