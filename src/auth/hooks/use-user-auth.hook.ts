import { useContext } from 'react';
import { userAuthContext } from '../context/user-auth.context';
import { UserAuthContextI } from '../models/user-auth-context.interface';

export function useUserAuth() {
  return useContext<UserAuthContextI>(userAuthContext);
}
