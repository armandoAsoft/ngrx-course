import { isDevMode } from '@angular/core';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
  on
} from '@ngrx/store';
import { User } from '../model/user.model';
import { AuthActions } from '../action-types';

export interface AuthState {
  user: User | null;
}

export const initialAuthState: AuthState = {
  user: null
};

export const authReducer = createReducer(
  initialAuthState,
  on(AuthActions.login, (state, action) => {
    console.log('Login action received in reducer', action);
    return {
      user: action.user
    }
  }),
  on(AuthActions.logout, (state, action) => {
    return {
      user: null
    }
  })
);

