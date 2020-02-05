/*
 * Cloud Functions
 */

import * as functions from 'firebase-functions';
import * as Database from './database';
import * as Mailer from './emails';

/*
 * User
 */

exports.processUserCreation = functions.auth.user().onCreate(async user => {
  const { email, uid } = user;
  const safeEmail = email as string;
  try {
    await Promise.all([
      Mailer.sendEmailToAdmin(`${safeEmail} has just signed up.`),
      Mailer.sendWelcomeEmail(safeEmail),
      Database.setUserDoc(uid, {
        email: safeEmail,
        homeCountryCode: null,
        lastEventNumber: 0,
      }),
    ]);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
});

exports.processUserDeletion = functions.auth
  .user()
  .onDelete(async ({ uid, email }) => {
    try {
      // Delete user document and all nested data.
      await Database.deleteUserEvents(uid);
      await Database.deleteAllUserTravels(uid);
      await Database.deleteAllUserResidencies(uid);
      await Database.deleteUserDoc(uid);
      await Mailer.sendEmailToAdmin(
        `The account of ${email} has just been deleted.`
      );
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

/*
 * This is based on the Firestore document as it is not currently possible to react to
 * Firebase Authentication directly
 */

exports.processUserUpdate = functions.firestore
  .document('users/{userID}')
  .onUpdate(async ({ before, after }) => {
    const uid = after.id;
    const userDocBefore = before.data() as Database.UserDoc;
    const userDocAfter = after.data() as Database.UserDoc;

    /*
     * Important: If the field that was updated is lastEventNumber, we stop
     * processing the update in order to avoid explosion.
     */
    if (userDocBefore.lastEventNumber !== userDocAfter.lastEventNumber)
      return Promise.resolve();

    try {
      // Update Firebase Auth email so it is consistent with Firestore
      if (userDocBefore.email !== userDocAfter.email)
        await Database.auth().updateUser(uid, { email: userDocAfter.email });
      await Database.createUserEventDoc(uid, { type: 'UPDATE_USER_DETAILS' });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

/*
 * Residencies
 */

exports.processResidencyCreation = functions.firestore
  .document('users/{userID}/residencies/{residencyID}')
  .onCreate(async snapshot => {
    const userDoc = snapshot.ref.parent.parent;

    if (!userDoc) throw new Error('User document does not exist.');

    try {
      const { id: uid } = userDoc;
      await Database.createUserEventDoc(uid, {
        type: 'ADD_RESIDENCY',
        residencyID: snapshot.id,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

exports.processResidencyUpdate = functions.firestore
  .document('users/{userID}/residencies/{residencyID}')
  .onUpdate(async ({ after }) => {
    // 'before' will work as well
    const userDoc = after.ref.parent.parent;

    if (!userDoc) throw new Error('User document does not exist.');

    try {
      const { id: uid } = userDoc;
      await Database.createUserEventDoc(uid, {
        type: 'UPDATE_RESIDENCY',
        residencyID: after.id,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

exports.processResidencyDeletion = functions.firestore
  .document('users/{userID}/residencies/{residencyID}')
  .onDelete(async snapshot => {
    const userDoc = snapshot.ref.parent.parent;

    if (!userDoc) throw new Error('User document does not exist.');

    try {
      const { id: uid } = userDoc;
      await Database.createUserEventDoc(uid, {
        type: 'DELETE_RESIDENCY',
        residencyID: snapshot.id,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

/*
 * Travels
 */

exports.processTravelCreation = functions.firestore
  .document('users/{userID}/travels/{travelID}')
  .onCreate(async snapshot => {
    const userDoc = snapshot.ref.parent.parent;

    if (!userDoc) throw new Error('User document does not exist.');

    try {
      const { id: uid } = userDoc;
      await Database.createUserEventDoc(uid, {
        type: 'ADD_TRAVEL',
        travelID: snapshot.id,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

exports.processTravelUpdate = functions.firestore
  .document('users/{userID}/travels/{travelID}')
  .onUpdate(async ({ after }) => {
    // 'before' will work as well
    const userDoc = after.ref.parent.parent;

    if (!userDoc) throw new Error('User document does not exist.');

    try {
      const { id: uid } = userDoc;
      await Database.createUserEventDoc(uid, {
        type: 'UPDATE_TRAVEL',
        travelID: after.id,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });

exports.processTravelDeletion = functions.firestore
  .document('users/{userID}/travels/{travelID}')
  .onDelete(async snapshot => {
    const userDoc = snapshot.ref.parent.parent;

    if (!userDoc) throw new Error('User document does not exist.');

    try {
      const { id: uid } = userDoc;
      await Database.createUserEventDoc(uid, {
        type: 'DELETE_TRAVEL',
        travelID: snapshot.id,
      });
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  });
