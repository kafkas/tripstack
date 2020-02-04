import * as API from '../../api';
import * as Database from '../../database';
import store from '../../store';
import { downloadUserInfo } from '../auth/userInfo';
import {
  downloadUserTravels,
  downloadUserResidencies,
  refreshData,
} from '../data';
import { Dispatch } from '..';
import * as AC from './actionCreators';
import { createTasksFromEvents, delegateTasks } from './tasks';

export function syncDeviceWithCloudAndRefresh() {
  return async (dispatch: Dispatch) => {
    const { uid } = store.getState().auth.userInfo;
    await syncDeviceWithCloud(uid, dispatch);
    await refreshData(dispatch);
  };
}

export async function syncDeviceWithCloud(uid: string, dispatch: Dispatch) {
  dispatch(AC.startSyncRequest());
  try {
    // Get last processed event number from db
    const lastProcessedEventNumber = await Database.abstract.getLastProcessedEventNumber();
    if (!lastProcessedEventNumber) {
      // This is the first sync. Fetch all data and put in DB/Redux (i.e. inefficient sync)
      await downloadAllCloudData(uid, dispatch);
    } else {
      // Fetch all events after `lastProcessedEventNumber`
      const newEvents = await API.requestUserEvents(
        uid,
        lastProcessedEventNumber
      );
      if (newEvents.length === 0) {
        // No new events, sync is successful
        dispatch(AC.receiveSyncResponse());
        return dispatch(AC.clearSyncProgress());
      }
      newEvents.sort((e1, e2) => e1.number - e2.number);
      /*
       * Important: Now check the number of the first new event. If it's more than 1 greater than
       * `lastProcessedEventNumber` then it must be that the server has cleaned up all the events
       * whose number is between `lastProcessedEventNumber` and events[0].number. If this is the
       * case, we must do the inefficient sync.
       */
      if (newEvents[0].number - lastProcessedEventNumber > 1) {
        await downloadAllCloudData(uid, dispatch);
      } else {
        // Otherwise process all of these events
        await processEvents(newEvents, uid, dispatch);
      }
    }
    dispatch(AC.receiveSyncResponse());
    return dispatch(AC.clearSyncProgress());
  } catch (err) {
    dispatch(AC.receiveSyncError(err));
    return Promise.reject(err);
  }
}

async function downloadAllCloudData(uid: string, dispatch: Dispatch) {
  try {
    const lastEventNumber = await downloadUserInfo(uid, dispatch);
    if (!lastEventNumber) {
      // The user has just signed up. The server is in the process of creating
      // the user document in Firestore.
    } else {
      await Promise.all([
        downloadUserResidencies(uid),
        downloadUserTravels(uid),
      ]);
      await Database.abstract.setLastProcessedEventNumber(lastEventNumber);
    }
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

async function processEvents(
  events: API.FirestoreEventDoc[],
  uid: string,
  dispatch: Dispatch
) {
  if (events.length === 0) return Promise.resolve();
  const tasks = createTasksFromEvents(events);
  const delegatedTasks = delegateTasks(tasks, uid, dispatch);
  try {
    await Promise.all(delegatedTasks);
    // If all tasks have been carried out, update last processed event number
    const lastEventNumber = tasks[tasks.length - 1].eventNumber;
    await Database.abstract.setLastProcessedEventNumber(lastEventNumber);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}
