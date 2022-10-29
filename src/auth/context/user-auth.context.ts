import { createContext } from 'react';
import { UserAuthContextI } from '../models/user-auth-context.interface';

const INITIAL_VALUE: UserAuthContextI = {
  logIn: async () => null,
  logOut: async () => {},
};

export const userAuthContext = createContext<UserAuthContextI>(INITIAL_VALUE);
