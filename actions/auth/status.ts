import * as Database from '../../database';
import * as API from '../../api';
import { SET_AUTH_STATUS } from '../types';
import { syncDeviceWithCloud } from '../sync';
import { refreshData } from '../data';
import { ActionCreator, AuthStatusAction, Dispatch } from '..';
import { ReduxAuthUserInfo } from '../../reducers';

const setAuthStatusToSignedIn: ActionCreator<AuthStatusAction> = (
  userInfo: ReduxAuthUserInfo
) => ({
  type: SET_AUTH_STATUS,
  payload: { status: 'SIGNED_IN', userInfo },
});

const setAuthStatusToSignedOut: ActionCreator<AuthStatusAction> = () => ({
  type: SET_AUTH_STATUS,
  payload: { status: 'SIGNED_OUT' },
});

export const subscribeToAuthStateChange = () => (dispatch: Dispatch) => {
  API.initialize();

  return API.requestAuthStateListener(async (user: API.UserInfo) => {
    if (!user) {
      // Signed out
      Database.clear();
      return dispatch(setAuthStatusToSignedOut());
    }

    // Signed in
    Database.initialize();
    const userInfo: ReduxAuthUserInfo = { email: user.email, uid: user.uid };
    await syncDeviceWithCloud(user.uid, dispatch);
    await refreshData(dispatch);
    return dispatch(setAuthStatusToSignedIn(userInfo));
  });
};
