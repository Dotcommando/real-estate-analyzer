import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { StorageOption } from '@ngxs/storage-plugin/src/symbols';
import { NgxsModule } from '@ngxs/store';

import { routes } from './app.routes';
import { InvitationState } from './store/invitation';
import { SearchRentState, SearchSaleState, SearchTypeState } from './store/search-form';
import { SearchResultsState } from './store/search-results';

import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    importProvidersFrom(
      NgxsModule.forRoot(
        [ SearchTypeState, SearchRentState, SearchSaleState, SearchResultsState, InvitationState ],
        {
          developmentMode: !environment.production,
          selectorOptions: {
            suppressErrors: environment.production,
            injectContainerState: false,
          },
        },
      ),
      NgxsStoragePluginModule.forRoot({
        key: [ 'searchType', 'searchRent', 'searchSale', 'searchResults', 'invitation' ],
        storage: StorageOption.LocalStorage,
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
    ),
  ],
};
