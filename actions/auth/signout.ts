import { requestSignout } from '../../api';
import { REQUEST_SIGNOUT } from '../types';
import { ActionCreator, NetworkAction, Dispatch } from '..';

const startSignoutRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNOUT,
  progress: {
    message: 'Requesting signout...',
    status: 'REQUEST',
  },
});

const receiveSignoutResponse: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNOUT,
  progress: {
    message: 'Signout success.',
    status: 'SUCCESS',
  },
});

const receiveSignoutError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_SIGNOUT,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearSignoutProgress: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNOUT,
  progress: {
    message: null,
    status: null,
  },
});

export const signoutUser = () => async (dispatch: Dispatch) => {
  dispatch(startSignoutRequest());

  try {
    const res = await requestSignout();
    return dispatch(receiveSignoutResponse(res));
  } catch (err) {
    return dispatch(receiveSignoutError(err));
  }
};
