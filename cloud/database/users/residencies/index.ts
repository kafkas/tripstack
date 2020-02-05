import { userDoc } from '..';

/*
 * /users/{userID}/residencies/{residencyID}
 */

export const userResidenciesCollection = (uid: string) =>
  userDoc(uid).collection('residencies');

export const userResidencyDoc = (uid: string, residencyID: string) =>
  userResidenciesCollection(uid).doc(residencyID);

export interface ResidencyDoc {
  cityCode: string;
  fromDate: string;
  toDate: string | null;
}

/*
 * Operations
 */

export async function deleteAllUserResidencies(uid: string) {
  try {
    const tasks = (await userResidenciesCollection(uid).get()).docs.map(
      snapshot => snapshot.ref.delete()
    );
    await Promise.all(tasks);
    return tasks.length;
  } catch (err) {
    return Promise.reject(err);
  }
}
