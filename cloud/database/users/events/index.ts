import { userDoc, updateUserDoc, UserDoc } from '..';

/*
 * /users/{userID}/eventDoc/{eventID}
 */

export const userEventsCollection = (uid: string) =>
  userDoc(uid).collection('events');

export const userEventDoc = (uid: string, eventID: string) =>
  userEventsCollection(uid).doc(eventID);

export interface EventDoc {
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

/*
 * Operations
 */

export async function createUserEventDoc(
  uid: string,
  doc: Omit<EventDoc, 'number'>
) {
  try {
    // Get user's last event number
    const snapshot = await userDoc(uid).get();
    const { lastEventNumber } = snapshot.data() as UserDoc;
    const newEventNumber = lastEventNumber + 1;
    const eventDoc: EventDoc = {
      number: newEventNumber,
      ...doc,
    };
    // Create the event document
    await userEventsCollection(uid).add(eventDoc);
    // Update user's last event number
    await updateUserDoc(uid, { lastEventNumber: newEventNumber });
    return newEventNumber;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Deletes user event documents.
 * @param uid User uid.
 * @param before If provided, all events whose number field is less than `before` get deleted. If omitted, all events get deleted.
 */
export async function deleteUserEvents(uid: string, before?: number) {
  try {
    const relevantCollection = before
      ? userEventsCollection(uid).where('number', '<', before)
      : userEventsCollection(uid);
    const tasks = (await relevantCollection.get()).docs.map(snapshot =>
      snapshot.ref.delete()
    );
    await Promise.all(tasks);
    return tasks.length;
  } catch (err) {
    return Promise.reject(err);
  }
}
