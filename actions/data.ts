import * as API from '../api';
import * as Database from '../database';
import * as ActionTypes from './types';
import { Dispatch } from '.';

/*
 * Helper functions
 */

export async function refreshData(dispatch: Dispatch) {
  try {
    const [residencies, travelHistory] = await Promise.all([
      Database.getResidencies(),
      Database.getTravelHistory(),
    ]);
    const userInfo = {};
    dispatch({
      type: ActionTypes.REFRESH_STORE_WITH_DB_DATA_SUCCESS,
      payload: {
        residencies,
        travelHistory,
        userInfo,
      },
    });
  } catch (err) {
    dispatch({
      type: ActionTypes.REFRESH_STORE_WITH_DB_DATA_FAIL,
      payload: err,
    });
  }
}

/*
 * Travels
 */

export async function downloadUserTravels(uid: string) {
  try {
    const results = await API.requestUserTravels(uid);
    return Promise.all(
      results.map(({ travelDoc, travelID }) =>
        processFirestoreTravelDocAndSaveToDB(travelDoc, travelID)
      )
    );
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function downloadUserTravel(uid: string, travelID: string) {
  try {
    const firestoreTravelDoc = await API.requestUserTravel(uid, travelID);
    await processFirestoreTravelDocAndSaveToDB(firestoreTravelDoc, travelID);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

function processFirestoreTravelDocAndSaveToDB(
  firestoreTravelDoc: API.FirestoreTravelDoc,
  travelID: string
) {
  // TODO: Copy more carefully. Field names may differ in the future
  const databaseTravelDoc: Database.LocalDBTravelDoc = {
    ...firestoreTravelDoc,
    id: travelID,
  };
  return Database.setTravel(travelID, databaseTravelDoc);
}

/*
 * Residencies
 */

export async function downloadUserResidencies(uid: string) {
  try {
    const results = await API.requestUserResidencies(uid);
    return Promise.all(
      results.map(({ residencyDoc, residencyID }) =>
        processFirestoreResidencyDocAndSaveToDB(residencyDoc, residencyID)
      )
    );
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function downloadUserResidency(uid: string, residencyID: string) {
  try {
    const firestoreResidencyDoc = await API.requestUserResidency(
      uid,
      residencyID
    );
    await processFirestoreResidencyDocAndSaveToDB(
      firestoreResidencyDoc,
      residencyID
    );
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
}

function processFirestoreResidencyDocAndSaveToDB(
  firestoreResidencyDoc: API.FirestoreResidencyDoc,
  residencyID: string
) {
  // TODO: Copy more carefully. Field names may differ in the future
  const databaseResidencyDoc: Database.LocalDBResidencyDoc = {
    ...firestoreResidencyDoc,
    id: residencyID,
  };
  return Database.setResidency(residencyID, databaseResidencyDoc);
}
