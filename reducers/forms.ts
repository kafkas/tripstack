import * as ActionTypes from '../actions/types';
import City from '../data-types/City';
import Country from '../data-types/Country';
import { Action, NetworkAction, AuthStatusAction } from '../actions';
import { Progress } from './common';

interface ReduxFormsCityPicker {
  selected: City | null;
}

interface ReduxFormsCountryPicker {
  selected: Country | null;
}

interface ReduxFormsTravelDetails {
  progress: Progress;
}

interface ReduxFormsResidencyDetails {
  progress: Progress;
}

export interface ReduxForms {
  cityPicker: ReduxFormsCityPicker;
  countryPicker: ReduxFormsCountryPicker;
  travelDetails: ReduxFormsTravelDetails;
  residencyDetails: ReduxFormsResidencyDetails;
}

export type TravelForm = 'addTravel' | 'editTravel';

const INITIAL_STATE: ReduxForms = {
  cityPicker: {
    selected: null,
  },
  countryPicker: {
    selected: null,
  },
  travelDetails: {
    progress: {
      message: null,
      status: null,
    },
  },
  residencyDetails: {
    progress: {
      message: null,
      status: null,
    },
  },
};

const cityPicker = (state: ReduxFormsCityPicker, action: Action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_SELECTED_CITY: {
      let selected: City | null;
      const payload = action.payload as City | null;
      if (payload === null) selected = null;
      else if (!!state.selected && payload.equals(state.selected))
        selected = null;
      else selected = action.payload;
      return { ...state, selected };
    }
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return { ...state, selected: null };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const countryPicker = (state: ReduxFormsCountryPicker, action: Action) => {
  switch (action.type) {
    case ActionTypes.TOGGLE_SELECTED_COUNTRY: {
      let selected: Country | null;
      if (action.payload === null) selected = null;
      else if ((action.payload as Country).equals(state.selected))
        selected = null;
      else selected = action.payload;
      return { ...state, selected };
    }
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return { ...state, selected: null };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const travelDetails = (
  state: ReduxFormsTravelDetails,
  action: Action
): ReduxFormsTravelDetails => {
  switch (action.type) {
    case ActionTypes.REQUEST_CHANGE_TRAVEL_DETAILS:
      return { ...state, progress: (action as NetworkAction).progress };
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return {
            ...state,
            progress: {
              message: null,
              status: null,
            },
          };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

const residencyDetails = (
  state: ReduxFormsResidencyDetails,
  action: Action
): ReduxFormsResidencyDetails => {
  switch (action.type) {
    case ActionTypes.REQUEST_CHANGE_RESIDENCY_DETAILS:
      return { ...state, progress: (action as NetworkAction).progress };
    case ActionTypes.SET_AUTH_STATUS: {
      switch ((action as AuthStatusAction).payload.status) {
        case 'SIGNED_OUT':
          return {
            ...state,
            progress: {
              message: null,
              status: null,
            },
          };
        default:
          return state;
      }
    }
    default:
      return state;
  }
};

export default (state = INITIAL_STATE, action: Action): ReduxForms => {
  switch (action.type) {
    case ActionTypes.TOGGLE_SELECTED_CITY: {
      return {
        ...state,
        cityPicker: cityPicker(state.cityPicker, action),
      };
    }
    case ActionTypes.TOGGLE_SELECTED_COUNTRY: {
      return {
        ...state,
        countryPicker: countryPicker(state.countryPicker, action),
      };
    }
    case ActionTypes.REQUEST_CHANGE_TRAVEL_DETAILS:
      return {
        ...state,
        travelDetails: travelDetails(state.travelDetails, action),
      };
    case ActionTypes.REQUEST_CHANGE_RESIDENCY_DETAILS:
      return {
        ...state,
        residencyDetails: residencyDetails(state.residencyDetails, action),
      };
    default:
      return state;
  }
};
