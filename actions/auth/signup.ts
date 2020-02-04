import { requestSignup } from '../../api';
import { REQUEST_SIGNUP } from '../types';
import { ActionCreator, NetworkAction, Dispatch } from '..';

const startSignupRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNUP,
  progress: {
    message: 'Requesting signup...',
    status: 'REQUEST',
  },
});

const receiveSignupResponse: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNUP,
  progress: {
    message: 'Signup successful.',
    status: 'SUCCESS',
  },
});

const receiveSignupError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_SIGNUP,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearSignupProgress: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SIGNUP,
  progress: {
    message: null,
    status: null,
  },
});

export const signupUser = (email: string, password: string) => async (
  dispatch: Dispatch
) => {
  dispatch(startSignupRequest({ email, password }));

  try {
    const { user } = await requestSignup(email, password);

    return dispatch(receiveSignupResponse(user));
  } catch (err) {
    return dispatch(receiveSignupError(err));
  }
};
