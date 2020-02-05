import { requestUpdatePassword } from '../../api';
import { REQUEST_UPDATE_PASSWORD } from '../types';
import { ActionCreator, NetworkAction, Dispatch } from '..';

const startUpdatePasswordRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_UPDATE_PASSWORD,
  progress: {
    message: 'Sending password update request...',
    status: 'REQUEST',
  },
});

const receiveUpdatePasswordResponse: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_UPDATE_PASSWORD,
  progress: {
    message: 'Password update successful.',
    status: 'SUCCESS',
  },
});

const receiveUpdatePasswordError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_UPDATE_PASSWORD,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearUpdatePasswordProgress: ActionCreator<
  NetworkAction
> = () => ({
  type: REQUEST_UPDATE_PASSWORD,
  progress: {
    message: null,
    status: null,
  },
});

export const updateUserPassword = (newPassword: string) => async (
  dispatch: Dispatch
) => {
  dispatch(startUpdatePasswordRequest());

  try {
    const res = await requestUpdatePassword(newPassword);
    return dispatch(receiveUpdatePasswordResponse(res));
  } catch (err) {
    return dispatch(receiveUpdatePasswordError(err));
  }
};
