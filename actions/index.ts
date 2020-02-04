import { Action as ReduxAction } from 'redux';
import { ReduxAuthStatus, ReduxAuthUserInfo } from '../reducers';
import { Progress } from '../reducers/common';

export { ActionCreator, Dispatch } from 'redux';
export { ThunkAction, ThunkDispatch } from 'redux-thunk';

/*
 * Commonly used action types
 */

export interface Action extends ReduxAction<string> {
  payload?: object | string | boolean | number;
}

export interface NetworkAction extends Action {
  progress: Progress;
}

export interface AuthStatusAction extends Action {
  payload: {
    status: ReduxAuthStatus;
    userInfo?: ReduxAuthUserInfo;
  };
}
