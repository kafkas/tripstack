import * as ActionTypes from '../actions/types';
import { Action, NetworkAction, AuthStatusAction } from '../actions';
import { Progress } from './common';

export interface ReduxSync {
  progress: Progress;
}

const INITIAL_STATE: ReduxSync = {
  progress: {
    message: null,
    status: null,
  },
};

export default (state = INITIAL_STATE, action: Action): ReduxSync => {
  switch (action.type) {
    case ActionTypes.REQUEST_SYNC:
      return { ...state, progress: (action as NetworkAction).progress };
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return {
            ...state,
            progress: {
              message: null,
              status: null,
            },
          };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};
