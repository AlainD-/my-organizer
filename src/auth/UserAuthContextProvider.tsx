import { getRedirectResult, onAuthStateChanged, signInWithRedirect, signOut, Unsubscribe, User, UserCredential } from 'firebase/auth';
import { ReactNode, useEffect, useState } from 'react';
import { auth } from '../startup/firebase';
import { userAuthContext } from './context/user-auth.context';
import { googleProvider } from './providers/providers';

export default function UserAuthContextProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User|null>(null);

  const logIn = async (): Promise<UserCredential | null> => {
    try {
      // Start a sign in process for an unauthenticated user.
      await signInWithRedirect(auth, googleProvider);
      // This will trigger a full page redirect away from your app
      // After returning from the redirect when your app initializes you can obtain the result
      const result: UserCredential | null = await getRedirectResult(auth);
      // if (result) {
      //   // This gives you a Google Access Token.
      //   const credential: OAuthCredential | null = GoogleAuthProvider.credentialFromResult(result);
      //   const token: string | undefined = credential?.accessToken;
      //   // This is the signed-in user
      //   const user: User = result.user;
      // }

      return result;
    } catch (error: any) {
      throw error;
    }
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
