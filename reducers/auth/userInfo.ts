import { Action, NetworkAction, AuthStatusAction } from '../../actions';
import * as ActionTypes from '../../actions/types';
import { Progress } from '../common';

export interface ReduxAuthUserInfo {
  uid: string | null;
  email: string | null;
  progress: Progress;
}

export const userInfo = (
  state: ReduxAuthUserInfo,
  action: Action
): ReduxAuthUserInfo => {
  switch (action.type) {
    case ActionTypes.REQUEST_UPDATE_USER_INFO: {
      const updatedUserInfo =
        (action as NetworkAction).progress.status === 'SUCCESS'
          ? action.payload
          : {};
      return {
        ...state,
        ...updatedUserInfo,
        progress: (action as NetworkAction).progress,
      };
    }
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return {};
        case 'SIGNED_IN':
          return { ...state, ...(action as AuthStatusAction).payload.userInfo };
        default:
          return state;
      }
    }
    // This is probably not needed but let's try for extra safety.
    case ActionTypes.REQUEST_SIGNOUT: {
      switch ((action as NetworkAction).progress.status) {
        case 'SUCCESS':
          return {};
        default:
          return state;
      }
    }
    case ActionTypes.REFRESH_STORE_WITH_DB_DATA_SUCCESS:
      return { ...state, ...action.payload.userInfo };
    default:
      return state;
  }
};
