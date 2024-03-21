import { Injectable } from '@angular/core';

import { Action, Selector, State, StateContext } from '@ngxs/store';

import { SEARCH_RENT_STATE_DEFAULT, SEARCH_SALE_STATE_DEFAULT } from './search.defaults';
import { ISearchState } from './search.model';

import { PAGINATION_MAX_LIMIT } from '../../constants';


export class ChangeType {
  static readonly type = '[Search Form] Change Type';
  constructor(public searchType: 'rent' | 'sale') {}
}

export class UpdateRentSearchState {
  static readonly type = '[Search Form] Update Rent State';
  constructor(public searchRentUpdate: Partial<ISearchState>) {}
}

export class UpdateSaleSearchState {
  static readonly type = '[Search Form] Update Sale State';
  constructor(public searchSaleUpdate: Partial<ISearchState>) {}
}

@State<ISearchState>({
  name: 'searchRent',
  defaults: SEARCH_RENT_STATE_DEFAULT,
})
@Injectable()
export class SearchRentState {
  @Selector()
  public static getRentState(state: ISearchState): ISearchState {
    return state;
  }

  @Action(UpdateRentSearchState)
  public updateSearch(ctx: StateContext<ISearchState>, action: UpdateRentSearchState): void {
    const state = ctx.getState();

    ctx.patchState({
      ...state,
      filters: {
        ...state.filters,
        ...action.searchRentUpdate.filters,
      },
      sorts: {
        ...state.sorts,
        ...action.searchRentUpdate.sorts,
      },
      offset: typeof action.searchRentUpdate.offset === 'number'
        ? action.searchRentUpdate.offset
        : 0,
      limit: typeof action.searchRentUpdate.limit === 'number'
        ? Math.min(action.searchRentUpdate.limit, PAGINATION_MAX_LIMIT)
        : PAGINATION_MAX_LIMIT,
    });
  }
}

@State<ISearchState>({
  name: 'searchSale',
  defaults: SEARCH_SALE_STATE_DEFAULT,
})
@Injectable()
export class SearchSaleState {
  @Selector()
  public static getSaleState(state: ISearchState): ISearchState {
    return state;
  }

  @Action(UpdateSaleSearchState)
  public updateSearch(ctx: StateContext<ISearchState>, action: UpdateSaleSearchState): void {
    const state = ctx.getState();

    ctx.patchState({
      ...state,
      filters: {
        ...state.filters,
        ...action.searchSaleUpdate.filters,
      },
      sorts: {
        ...state.sorts,
        ...action.searchSaleUpdate.sorts,
      },
      offset: typeof action.searchSaleUpdate.offset === 'number'
        ? action.searchSaleUpdate.offset
        : 0,
      limit: typeof action.searchSaleUpdate.limit === 'number'
        ? Math.min(action.searchSaleUpdate.limit, PAGINATION_MAX_LIMIT)
        : PAGINATION_MAX_LIMIT,
    });
  }
}

@State<'rent' | 'sale'>({
  name: 'searchType',
  defaults: 'rent',
})
@Injectable()
export class SearchTypeState {
  @Selector()
  static searchType(state: 'rent' | 'sale'): 'rent' | 'sale' {
    return state ?? 'rent';
  }

  @Action(ChangeType)
  public changeType(ctx: StateContext<'rent' | 'sale'>, action: ChangeType): void {
    ctx.setState(action.searchType);
  }
}
