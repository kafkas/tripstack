import { REQUEST_SYNC } from '../types';
import { ActionCreator, NetworkAction } from '..';

export const startSyncRequest: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SYNC,
  progress: {
    message: 'Requesting sync...',
    status: 'REQUEST',
  },
});

export const receiveSyncResponse: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SYNC,
  progress: {
    message: 'Sync success.',
    status: 'SUCCESS',
  },
});

export const receiveSyncError: ActionCreator<NetworkAction> = err => ({
  type: REQUEST_SYNC,
  progress: {
    message: err.message || 'An unknown error has occured.',
    status: 'ERROR',
  },
});

export const clearSyncProgress: ActionCreator<NetworkAction> = () => ({
  type: REQUEST_SYNC,
  progress: {
    message: null,
    status: null,
  },
});
