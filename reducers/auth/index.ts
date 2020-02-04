import { Action } from '../../actions';
import * as ActionTypes from '../../actions/types';
import { resetPassword, ReduxAuthResetPassword } from './resetPassword';
import { signin, ReduxAuthSignin } from './signin';
import { signout, ReduxAuthSignout } from './signout';
import { signup, ReduxAuthSignup } from './signup';
import { status, ReduxAuthStatus } from './status';
import { updatePassword, ReduxAuthUpdatePassword } from './updatePassword';
import { userInfo, ReduxAuthUserInfo } from './userInfo';

export interface ReduxAuth {
  signup: ReduxAuthSignup;
  signin: ReduxAuthSignin;
  signout: ReduxAuthSignout;
  updatePassword: ReduxAuthUpdatePassword;
  resetPassword: ReduxAuthResetPassword;
  userInfo: ReduxAuthUserInfo;
  status: ReduxAuthStatus;
}

const INITIAL_STATE: ReduxAuth = {
  signup: {
    progress: { message: null, status: null },
  },
  signin: {
    progress: { message: null, status: null },
  },
  signout: {
    progress: { message: null, status: null },
  },
  updatePassword: {
    progress: { message: null, status: null },
  },
  resetPassword: {
    progress: { message: null, status: null },
  },
  userInfo: {
    uid: null,
    email: null,
    progress: { message: null, status: null },
  },
  status: 'CHECKING',
};

export default (state = INITIAL_STATE, action: Action): ReduxAuth => {
  switch (action.type) {
    case ActionTypes.REQUEST_SIGNUP:
    case ActionTypes.REQUEST_SIGNIN:
      return {
        ...state,
        signup: signup(state.signup, action),
        signin: signin(state.signin, action),
      };
    case ActionTypes.REQUEST_SIGNOUT:
      return {
        ...state,
        signout: signout(state.signout, action),
        userInfo: userInfo(state.userInfo, action),
      };
    case ActionTypes.REQUEST_UPDATE_PASSWORD:
      return {
        ...state,
        updatePassword: updatePassword(state.updatePassword, action),
      };
    case ActionTypes.REQUEST_RESET_PASSWORD:
      return {
        ...state,
        resetPassword: resetPassword(state.resetPassword, action),
      };
    case ActionTypes.REQUEST_UPDATE_USER_INFO:
    case ActionTypes.REFRESH_STORE_WITH_DB_DATA_SUCCESS:
      return { ...state, userInfo: userInfo(state.userInfo, action) };
    case ActionTypes.SET_AUTH_STATUS: {
      return {
        ...state,
        status: status(action),
        userInfo: userInfo(state.userInfo, action),
      };
    }
    default:
      return state;
  }
};

/*
 * Selectors
 */

/**
 * A selector that derives whether auth (i.e. signin and signup)
 * is disabled from Redux state.
 */
export function isAuthDisabled(state: ReduxAuth) {
  return (
    state.signin.progress.status === 'REQUEST' ||
    state.signout.progress.status === 'REQUEST' ||
    state.status === 'CHECKING' ||
    state.status === 'SIGNED_IN'
  );
}
