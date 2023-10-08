/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnyAction } from 'redux';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

export function ofAction(actions: any[]) {
  return (action$: Observable<AnyAction>) =>
    action$.pipe(
      filter((action) => {
        return actions.some((actionCreator) => actionCreator.match(action));
      }),
    );
}
