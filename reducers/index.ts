import { combineReducers } from 'redux';
import auth, { ReduxAuth } from './auth';
import data, { ReduxData } from './data';
import forms, { ReduxForms } from './forms';
import sync, { ReduxSync } from './sync';

export interface ReduxRoot {
  auth: ReduxAuth;
  data: ReduxData;
  forms: ReduxForms;
  sync: ReduxSync;
}

export * from './auth';
export * from './data';
export * from './forms';
export * from './sync';

export default combineReducers({
  auth,
  data,
  forms,
  sync,
});
