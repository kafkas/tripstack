import { Action, NetworkAction } from '../../actions';
import { REQUEST_RESET_PASSWORD } from '../../actions/types';
import { Progress } from '../common';

export interface ReduxAuthResetPassword {
  progress: Progress;
}

export const resetPassword = (
  state: ReduxAuthResetPassword,
  action: Action
): ReduxAuthResetPassword => {
  switch (action.type) {
    case REQUEST_RESET_PASSWORD:
      return { ...state, progress: (action as NetworkAction).progress };
    default:
      return state;
  }
};
