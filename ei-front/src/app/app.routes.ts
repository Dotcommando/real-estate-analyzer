import { Routes } from '@angular/router';

import { CookieConsentComponent } from './pages/cookie-consent/cookie-consent.component';
import { InvitationComponent } from './pages/invitation/invitation.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { SearchComponent } from './pages/search/search.component';
import { SerpComponent } from './pages/serp/serp.component';


export const routes: Routes = [
  { path: '', component: InvitationComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search-results', component: SerpComponent },
  { path: 'cookie-consent', component: CookieConsentComponent },
  { path: '**', component: NotFoundComponent },
];
