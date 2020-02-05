import { requestSignin } from '../../api';
import { REQUEST_SIGNIN } from '../types';
import { ActionCreator, NetworkAction, Dispatch } from '..';

const startSigninRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNIN,
  progress: {
    message: 'Requesting signin...',
    status: 'REQUEST',
  },
});

const receiveSigninResponse: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNIN,
  progress: {
    message: 'Signin successful.',
    status: 'SUCCESS',
  },
});

const receiveSigninError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_SIGNIN,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearSigninProgress: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNIN,
  progress: {
    message: null,
    status: null,
  },
});

export const signinUser = (email: string, password: string) => async (
  dispatch: Dispatch
) => {
  dispatch(startSigninRequest({ email, password }));

  try {
    const res = await requestSignin(email, password);
    return dispatch(receiveSigninResponse(res));
  } catch (err) {
    return dispatch(receiveSigninError(err));
  }
};
