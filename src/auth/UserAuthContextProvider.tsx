import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, Unsubscribe, User, UserCredential } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { auth } from '../startup/firebase';
import { userAuthContext } from './context/user-auth.context';

export default function UserAuthContextProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User|null>(null);

  const logIn = (): Promise<UserCredential> => {
    const googleProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = (): Promise<void> => signOut(auth);

  useEffect(() => {
    const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (currentUser: User | null) => {
      setUser(() => currentUser);
    });

    return () => {
      unsubscribe();
    }
  }, []);

  return (
    <userAuthContext.Provider value={{ user, logIn, logOut }}>
      {children}
    </userAuthContext.Provider>
  );
}
