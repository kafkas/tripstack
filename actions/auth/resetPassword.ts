import { requestResetPassword } from '../../api';
import { REQUEST_RESET_PASSWORD } from '../types';
import { ActionCreator, NetworkAction, Dispatch } from '..';

const startResetPasswordRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_RESET_PASSWORD,
  progress: {
    message: 'Sending password reset request...',
    status: 'REQUEST',
  },
});

const receiveResetPasswordResponse: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_RESET_PASSWORD,
  progress: {
    message:
      'Password reset request successful. Please check your email to proceed.',
    status: 'SUCCESS',
  },
});

const receiveResetPasswordError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_RESET_PASSWORD,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearResetPasswordProgress: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_RESET_PASSWORD,
  progress: {
    message: null,
    status: null,
  },
});

export const resetUserPassword = (email: string) => async (
  dispatch: Dispatch
) => {
  dispatch(startResetPasswordRequest());

  try {
    const res = await requestResetPassword(email);
    return dispatch(receiveResetPasswordResponse(res));
  } catch (err) {
    return dispatch(receiveResetPasswordError(err));
  }
};
