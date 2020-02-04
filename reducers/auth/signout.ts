import { Action, NetworkAction } from '../../actions';
import { REQUEST_SIGNOUT } from '../../actions/types';
import { Progress } from '../common';

export interface ReduxAuthSignout {
  progress: Progress;
}

export const signout = (
  state: ReduxAuthSignout,
  action: Action
): ReduxAuthSignout => {
  switch (action.type) {
    case REQUEST_SIGNOUT:
      return { ...state, progress: (action as NetworkAction).progress };
    default:
      return state;
  }
};
