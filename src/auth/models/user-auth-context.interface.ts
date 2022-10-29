import { User, UserCredential } from 'firebase/auth';

export interface UserAuthContextI {
  user?: User | null;
  logIn: () => Promise<UserCredential | null>;
  logOut: () => Promise<void>;
}
