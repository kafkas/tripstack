import { Action, NetworkAction } from '../../actions';
import { REQUEST_SIGNUP, REQUEST_SIGNIN } from '../../actions/types';
import { Progress } from '../common';

export interface ReduxAuthSignup {
  progress: Progress;
}

export const signup = (
  state: ReduxAuthSignup,
  action: Action
): ReduxAuthSignup => {
  switch (action.type) {
    case REQUEST_SIGNUP:
      return { ...state, progress: (action as NetworkAction).progress };
    case REQUEST_SIGNIN:
      return { ...state, progress: { message: null, status: null } };
    default:
      return state;
  }
};
