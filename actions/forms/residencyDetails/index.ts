import * as API from '../../../api';
import * as Database from '../../../database';
import City from '../../../data-types/City';
import ShortDate from '../../../data-types/ShortDate';
import store from '../../../store';
import { refreshData } from '../../data';
import ObjectUtil from '../../../util/ObjectUtil';
import { Dispatch } from '../..';
import * as AC from './actionCreators';
import { GRACEFUL_EXIT_DURATION } from '../../../styles/animations';

export function createResidency(
  city: City,
  fromDate: ShortDate,
  toDate: ShortDate | null,
  navigation: Navigation,
  progressHideDuration: number
) {
  return async (dispatch: Dispatch) => {
    dispatch(AC.startChangeResidencyDetailsRequest('CREATE'));
    const { uid } = store.getState().auth.userInfo;
    try {
      // Prepare residency details for Firestore
      const firestoreResidencyDoc: API.FirestoreResidencyDoc = {
        cityCode: city.getCode(),
        fromDate: fromDate.getYMDString(),
        toDate: toDate ? toDate.getYMDString() : null,
      };
      // Send the request and get the newly generated id for the residency.
      const { id } = await API.requestAddUserResidency(
        uid,
        firestoreResidencyDoc
      );
      // Prepare residency details for database
      const databaseResidencyDoc = ObjectUtil.copyExcept(firestoreResidencyDoc);
      // Add the newly generated id as well
      databaseResidencyDoc.id = id;
      await Database.createResidency(databaseResidencyDoc);
      await refreshData(dispatch);
      dispatch(AC.receiveChangeResidencyDetailsResponse('CREATE'));
      setTimeout(() => {
        navigation.navigate('HomeDrawer');
      }, GRACEFUL_EXIT_DURATION + progressHideDuration);
      setTimeout(() => {
        dispatch(AC.clearResidencyDetailsProgress());
      }, GRACEFUL_EXIT_DURATION);
    } catch (err) {
      dispatch(AC.receiveChangeResidencyDetailsError(err));
    }
  };
}

export function updateResidency(
  residencyID: string,
  city: City,
  fromDate: ShortDate,
  toDate: ShortDate | null,
  navigation: Navigation,
  progressHideDuration: number
) {
  return async (dispatch: Dispatch) => {
    dispatch(AC.startChangeResidencyDetailsRequest('UPDATE'));
    const { uid } = store.getState().auth.userInfo;
    try {
      // Prepare residency details for Firestore
      const firestoreResidencyDoc: Partial<API.FirestoreResidencyDoc> = {
        cityCode: city.getCode(),
        fromDate: fromDate.getYMDString(),
        toDate: toDate ? toDate.getYMDString() : null,
      };
      await API.requestUpdateUserResidency(
        uid,
        residencyID,
        firestoreResidencyDoc
      );
      // Prepare residency details for database
      const databaseResidencyDoc = ObjectUtil.copyExcept(firestoreResidencyDoc);
      // Add the newly generated id as well
      databaseResidencyDoc.id = residencyID;
      await Database.updateResidency(databaseResidencyDoc);
      await refreshData(dispatch);
      dispatch(AC.receiveChangeResidencyDetailsResponse('UPDATE'));
      setTimeout(() => {
        navigation.navigate('HomeDrawer');
      }, GRACEFUL_EXIT_DURATION + progressHideDuration);
      setTimeout(() => {
        dispatch(AC.clearResidencyDetailsProgress());
      }, GRACEFUL_EXIT_DURATION);
    } catch (err) {
      dispatch(AC.receiveChangeResidencyDetailsError(err));
    }
  };
}

export function deleteResidency(
  residencyID: string,
  navigation: Navigation,
  progressHideDuration: number
) {
  return async (dispatch: Dispatch) => {
    dispatch(AC.startChangeResidencyDetailsRequest('DELETE'));
    const { uid } = store.getState().auth.userInfo;
    try {
      await API.requestDeleteUserResidency(uid, residencyID);
      await Database.deleteResidency(residencyID);
      await refreshData(dispatch);
      dispatch(AC.receiveChangeResidencyDetailsResponse('DELETE'));
      setTimeout(() => {
        navigation.navigate('HomeDrawer');
      }, GRACEFUL_EXIT_DURATION + progressHideDuration);
      setTimeout(() => {
        dispatch(AC.clearResidencyDetailsProgress());
      }, GRACEFUL_EXIT_DURATION);
    } catch (err) {
      dispatch(AC.receiveChangeResidencyDetailsError(err));
    }
  };
}

export function clearResidencyDetailsProgress() {
  return AC.clearResidencyDetailsProgress();
}
