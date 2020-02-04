import * as ActionTypes from '../actions/types';
import Residency from '../data-types/Residency';
import TravelHistory from '../data-types/TravelHistory';
import { Action, AuthStatusAction } from '../actions';

export type ReduxDataResidencies = Residency[];
export type ReduxDataTravelHistory = TravelHistory;

export interface ReduxData {
  residencies: ReduxDataResidencies;
  travelHistory: ReduxDataTravelHistory;
}

const INITIAL_STATE: ReduxData = {
  residencies: [],
  travelHistory: [],
};

const residencies = (
  state: ReduxDataResidencies,
  action: Action
): ReduxDataResidencies => {
  switch (action.type) {
    case ActionTypes.REFRESH_STORE_WITH_DB_DATA_SUCCESS:
      return action.payload.residencies;
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return [];
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const travelHistory = (
  state: ReduxDataTravelHistory,
  action: Action
): ReduxDataTravelHistory => {
  switch (action.type) {
    case ActionTypes.REFRESH_STORE_WITH_DB_DATA_SUCCESS:
      return action.payload.travelHistory;
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return [];
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

export default (state = INITIAL_STATE, action: Action): ReduxData => {
  switch (action.type) {
    case ActionTypes.REFRESH_STORE_WITH_DB_DATA_SUCCESS:
    case ActionTypes.SET_AUTH_STATUS:
      return {
        ...state,
        residencies: residencies(state.residencies, action),
        travelHistory: travelHistory(state.travelHistory, action),
      };
    default:
      return state;
  }
};
