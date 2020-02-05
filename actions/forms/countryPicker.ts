import Country from '../../data-types/Country';
import { TOGGLE_SELECTED_COUNTRY } from '../types';
import { ActionCreator, Action } from '..';

export const selectCountry: ActionCreator<Action> = (
  country: Country | null
) => ({
  type: TOGGLE_SELECTED_COUNTRY,
  payload: !country ? null : country,
});
