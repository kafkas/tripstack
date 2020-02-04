import { userDoc } from './database';

const userEventsCollection = (uid: string) => userDoc(uid).collection('events');

/** The shape of each user event document that is stored in the remote database. */
export interface FirestoreEventDoc {
  type:
    | 'ADD_TRAVEL'
    | 'UPDATE_TRAVEL'
    | 'DELETE_TRAVEL'
    | 'ADD_RESIDENCY'
    | 'UPDATE_RESIDENCY'
    | 'DELETE_RESIDENCY'
    | 'UPDATE_USER_DETAILS';
  number: number;
  travelID?: string;
  residencyID?: string;
}

/** Get user events */
export async function requestUserEvents(uid: string, after: number) {
  try {
    const snapshot = await userEventsCollection(uid)
      .where('number', '>', after)
      .get();
    return snapshot.docs.map(docSnapshot => {
      const event = docSnapshot.data() as FirestoreEventDoc;
      return event;
    });
  } catch (err) {
    return Promise.reject(err);
  }
}
