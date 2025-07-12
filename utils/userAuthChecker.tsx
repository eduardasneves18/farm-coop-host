import { getAuth, onAuthStateChanged, User } from 'firebase/auth';

interface CheckOptions {
  onAuthenticated: (user: User) => void;
  onUnauthenticated?: () => void;
}

export const UserAuthChecker = {
  check: ({ onAuthenticated, onUnauthenticated }: CheckOptions) => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        onAuthenticated(user);
      } else {
        if (onUnauthenticated) onUnauthenticated();
      }
      unsubscribe();
    });
  },
};
