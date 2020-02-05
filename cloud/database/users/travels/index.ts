import { userDoc } from '..';

/*
 * /users/{userID}/travels/{travelID}
 */

export const userTravelsCollection = (uid: string) =>
  userDoc(uid).collection('travels');

export const userTravelDoc = (uid: string, travelID: string) =>
  userTravelsCollection(uid).doc(travelID);

export interface TravelDoc {
  originCode: string;
  departure: string;
  destinationCode: string;
  arrival: string;
}

/*
 * Operations
 */

export async function deleteAllUserTravels(uid: string) {
  try {
    const tasks = (await userTravelsCollection(uid).get()).docs.map(snapshot =>
      snapshot.ref.delete()
    );
    await Promise.all(tasks);
    return tasks.length;
  } catch (err) {
    return Promise.reject(err);
  }
}
