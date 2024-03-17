import { Injectable } from '@angular/core';

import { Action, State, StateContext } from '@ngxs/store';

import { SEARCH_RESULTS_STATE_DEFAULT } from './search-results.defaults';
import { ISearchResultsState, ISearchResultsStoryNote } from './search-results.model';

import { IRentResidentialId, ISaleResidentialId } from '../../types';


export class FetchSearchResults {
  static readonly type = '[Search] Fetch Results';
  constructor(public payload: { query: string }) {}
}

export class FetchSearchResultsSuccess {
  static readonly type = '[Search] Fetch Results Success';
  constructor(public payload: { result: IRentResidentialId[] | ISaleResidentialId[]; total: number }) {}
}

export class FetchSearchResultsFail {
  static readonly type = '[Search] Fetch Results Fail';
  constructor(public error: any) {}
}

export class SaveSearchQueryToStory {
  static readonly type = '[Search] Save Query to Story';
  constructor(public payload: ISearchResultsStoryNote) {}
}

@State<ISearchResultsState>({
  name: 'searchResults',
  defaults: SEARCH_RESULTS_STATE_DEFAULT,
})
@Injectable()
export class SearchResultsState {
  @Action(FetchSearchResults)
  public fetchSearchResults(ctx: StateContext<ISearchResultsState>, action: FetchSearchResults) {
    ctx.patchState({ status: 'PENDING' });
  }

  @Action(FetchSearchResultsSuccess)
  public fetchSearchResultsSuccess(ctx: StateContext<ISearchResultsState>, action: FetchSearchResultsSuccess) {
    ctx.patchState({
      result: action.payload.result,
      total: action.payload.total,
      status: 'SUCCESS',
    });
  }

  @Action(FetchSearchResultsFail)
  public fetchSearchResultsFail(ctx: StateContext<ISearchResultsState>, { error }: FetchSearchResultsFail) {
    ctx.patchState({ status: 'FAILED' });
  }

  @Action(SaveSearchQueryToStory)
  public saveSearchQueryToStory(ctx: StateContext<ISearchResultsState>, action: SaveSearchQueryToStory) {
    const state = ctx.getState();

    ctx.patchState({
      story: [ ...state.story, action.payload ],
    });
  }
}
