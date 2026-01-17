import { Auth, onAuthStateChanged, signInWithEmailAndPassword, signOut, User } from 'firebase/auth'; // Ou um tipo User genérico seu

export interface IAuthService {
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  listen: (callback: (user: User | null) => void) => () => void;
  getCurrentUser: () => User | null;
}

export class FirebaseAuthService implements IAuthService {
  constructor(private auth: Auth) {}

  async login(email: string, password: string): Promise<User> {
    const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
    return userCredential.user;
  }

  async logout(): Promise<void> {
    return signOut(this.auth);
  }

  listen(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(this.auth, callback);
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }
}
