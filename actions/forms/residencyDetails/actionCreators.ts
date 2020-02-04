import { REQUEST_CHANGE_RESIDENCY_DETAILS } from '../../types';
import { NetworkAction, ActionCreator } from '../..';

type ChangeKind = 'CREATE' | 'UPDATE' | 'DELETE';

export const startChangeResidencyDetailsRequest: ActionCreator<
  NetworkAction
> = (kind: ChangeKind) => {
  let message;
  if (kind === 'CREATE') message = 'Creating a new residency...';
  else if (kind === 'UPDATE') message = 'Updating the residency...';
  else if (kind === 'DELETE') message = 'Deleting the residency...';
  return {
    type: REQUEST_CHANGE_RESIDENCY_DETAILS,
    progress: {
      message,
      status: 'REQUEST',
    },
  };
};

export const receiveChangeResidencyDetailsResponse: ActionCreator<
  NetworkAction
> = (kind: ChangeKind) => {
  let message;
  if (kind === 'CREATE') message = 'Created successfully!';
  else if (kind === 'UPDATE') message = 'Updated successfully!';
  else if (kind === 'DELETE') message = 'Deleted successfully!';
  return {
    type: REQUEST_CHANGE_RESIDENCY_DETAILS,
    progress: { message, status: 'SUCCESS' },
  };
};

export const receiveChangeResidencyDetailsError: ActionCreator<
  NetworkAction
> = (err: API.FirestoreError) => {
  let modifiedMessage = 'An unknown error has occured.';
  if (err.code === 'not-found')
    modifiedMessage = 'The residency document does not exist.';

  return {
    type: REQUEST_CHANGE_RESIDENCY_DETAILS,
    progress: {
      message: modifiedMessage,
      status: 'ERROR',
    },
  };
};

export const clearResidencyDetailsProgress: ActionCreator<
  NetworkAction
> = () => ({
  type: REQUEST_CHANGE_RESIDENCY_DETAILS,
  progress: {
    message: null,
    status: null,
  },
});
