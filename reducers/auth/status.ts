import { AuthStatusAction } from '../../actions';

export type ReduxAuthStatus = 'CHECKING' | 'SIGNED_IN' | 'SIGNED_OUT';

export const status = (action: AuthStatusAction): ReduxAuthStatus =>
  action.payload.status;
