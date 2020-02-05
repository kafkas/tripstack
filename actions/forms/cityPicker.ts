import City from '../../data-types/City';
import { TOGGLE_SELECTED_CITY } from '../types';
import { ActionCreator, Action } from '..';

export const selectCity: ActionCreator<Action> = (city: City | null) => ({
  type: TOGGLE_SELECTED_CITY,
  payload: !city ? null : city,
});
