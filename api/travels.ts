import { userDoc } from './database';

const userTravelsCollection = (uid: string) =>
  userDoc(uid).collection('travels');

const userTravelDoc = (uid: string, travelID: string) =>
  userTravelsCollection(uid).doc(travelID);

/** The shape of each user travel document that is stored in the remote database. */
export interface FirestoreTravelDoc {
  originCode: string;
  departure: string;
  destinationCode: string;
  arrival: string;
}

/* Create, update, delete */
export function requestAddUserTravel(
  uid: string,
  travelDetails: FirestoreTravelDoc
) {
  return userTravelsCollection(uid).add(travelDetails);
}

export function requestUpdateUserTravel(
  uid: string,
  travelID: string,
  travelDetails: Partial<FirestoreTravelDoc>
) {
  return userTravelsCollection(uid)
    .doc(travelID)
    .update(travelDetails);
}

export function requestDeleteUserTravel(uid: string, travelID: string) {
  return userTravelsCollection(uid)
    .doc(travelID)
    .delete();
}

/* Get */
export async function requestUserTravel(uid: string, travelID: string) {
  try {
    const snapshot = await userTravelDoc(uid, travelID).get();
    return snapshot.data() as FirestoreTravelDoc;
  } catch (err) {
    return Promise.reject(err);
  }
}

export async function requestUserTravels(uid: string) {
  try {
    const snapshot = await userTravelsCollection(uid).get();
    return snapshot.docs.map(docSnap => ({
      travelID: docSnap.id,
      travelDoc: docSnap.data() as FirestoreTravelDoc,
    }));
  } catch (err) {
    return Promise.reject(err);
  }
}
