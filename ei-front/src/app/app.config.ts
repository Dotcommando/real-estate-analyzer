import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';

import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { StorageOption } from '@ngxs/storage-plugin/src/symbols';
import { NgxsModule } from '@ngxs/store';

import { routes } from './app.routes';
import { SearchRentState, SearchSaleState, SearchTypeState } from './components/search-form/search.store';

import { environment } from '../environments/environment';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimationsAsync(),
    importProvidersFrom(
      NgxsModule.forRoot(
        [ SearchTypeState, SearchRentState, SearchSaleState ],
        {
          developmentMode: !environment.production,
          selectorOptions: {
            suppressErrors: environment.production,
            injectContainerState: false,
          },
        },
      ),
      NgxsStoragePluginModule.forRoot({
        key: [ 'searchType', 'searchRent', 'searchSale' ],
        storage: StorageOption.LocalStorage,
      }),
      NgxsReduxDevtoolsPluginModule.forRoot(),
    ),
  ],
};
