import { Action, NetworkAction } from '../../actions';
import { REQUEST_UPDATE_PASSWORD } from '../../actions/types';
import { Progress } from '../common';

export interface ReduxAuthUpdatePassword {
  progress: Progress;
}

export const updatePassword = (
  state: ReduxAuthUpdatePassword,
  action: Action
): ReduxAuthUpdatePassword => {
  switch (action.type) {
    case REQUEST_UPDATE_PASSWORD:
      return { ...state, progress: (action as NetworkAction).progress };
    default:
      return state;
  }
};
