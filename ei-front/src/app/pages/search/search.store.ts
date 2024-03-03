import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SEARCH_STATE_DEFAULT } from './search.defaults';
import { ISearchState } from './search.model';


export class UpdateSearchState {
  static readonly type = '[Search] Update State';
  constructor(public searchUpdate: Partial<ISearchState>) {}
}

@State<ISearchState>({
  name: 'search',
  defaults: SEARCH_STATE_DEFAULT,
})
@Injectable()
export class SearchState {
  @Action(UpdateSearchState)
  public updateSearch(ctx: StateContext<ISearchState>, action: UpdateSearchState): void {
    const state = ctx.getState();

    ctx.patchState({
      ...state,
      ...action.searchUpdate,
    });
  }

  @Selector()
  static searchType(state: ISearchState): 'rent' | 'sale' {
    return state.filters?.type ?? 'rent';
  }
}
