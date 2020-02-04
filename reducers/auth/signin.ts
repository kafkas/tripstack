import { Action, NetworkAction } from '../../actions';
import { REQUEST_SIGNIN, REQUEST_SIGNUP } from '../../actions/types';
import { Progress } from '../common';

export interface ReduxAuthSignin {
  progress: Progress;
}

export const signin = (
  state: ReduxAuthSignin,
  action: Action
): ReduxAuthSignin => {
  switch (action.type) {
    case REQUEST_SIGNIN:
      return { ...state, progress: (action as NetworkAction).progress };
    case REQUEST_SIGNUP:
      return { ...state, progress: { message: null, status: null } };
    default:
      return state;
  }
};
