import * as firebase from 'firebase';
import 'firebase/firestore';

const database = () => firebase.firestore();

const usersCollection = () => database().collection('users');

export const userDoc = (uid: string) => usersCollection().doc(uid);

/** The shape of each user document stored in the remote database. */
export interface FirestoreUserDoc {
  email: string;
  lastEventNumber: number;
}

/** Get user details. */
export async function requestUserInfo(uid: string) {
  try {
    const snapshot = await userDoc(uid).get();
    return snapshot.data() as FirestoreUserDoc | undefined;
  } catch (err) {
    return Promise.reject(err);
  }
}

/**
 * Update user details.
 *
 * Important: Do not allow `set` operation or update `lastEventNumber` field from client.
 * This should only be done by the server.
 */
export function requestUpdateUserInfo(
  uid: string,
  details: Partial<Omit<FirestoreUserDoc, 'lastEventNumber'>>
) {
  return userDoc(uid).update(details);
}
