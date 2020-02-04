import * as API from '../../api';
import store from '../../store';
import { REQUEST_UPDATE_USER_INFO } from '../types';
import { ReduxAuthUserInfo } from '../../reducers';
import { ActionCreator, NetworkAction, Dispatch } from '..';

/*
 * Action creators
 */

const startUpdateUserInfoRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_UPDATE_USER_INFO,
  progress: {
    message: 'Updating...',
    status: 'REQUEST',
  },
});

const receiveUpdateUserInfoResponse: ActionCreator<NetworkAction> = (
  updatedInfo: Partial<ReduxAuthUserInfo>
) => ({
  type: REQUEST_UPDATE_USER_INFO,
  payload: updatedInfo,
  progress: {
    message: 'Update successful.',
    status: 'SUCCESS',
  },
});

const receiveUpdateUserInfoError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_UPDATE_USER_INFO,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearUpdateUserInfoProgress: ActionCreator<
  NetworkAction
> = () => ({
  type: REQUEST_UPDATE_USER_INFO,
  progress: {
    message: null,
    status: null,
  },
});

export const uploadUserInfo = (email: string) => async (dispatch: Dispatch) => {
  dispatch(startUpdateUserInfoRequest());
  const { uid } = store.getState().auth.userInfo;

  try {
    await API.requestUpdateUserInfo(uid, {
      email,
    });

    return dispatch(receiveUpdateUserInfoResponse({ email }));
  } catch (err) {
    return dispatch(receiveUpdateUserInfoError(err));
  }
};

/*
 * Helper functions
 */

export async function downloadUserInfo(uid: string, dispatch: Dispatch) {
  dispatch(startUpdateUserInfoRequest());
  try {
    const userDoc = await API.requestUserInfo(uid);

    if (!userDoc) {
      // The user has just signed up. The server is creating the user document in Firestore.
      return undefined;
    }

    const { email, lastEventNumber } = userDoc;

    const userInfo: ReduxAuthUserInfo = { email };
    dispatch(receiveUpdateUserInfoResponse(userInfo));
    dispatch(clearUpdateUserInfoProgress());
    return lastEventNumber;
  } catch (err) {
    dispatch(receiveUpdateUserInfoError(err));
    return Promise.reject(err);
  }
}
