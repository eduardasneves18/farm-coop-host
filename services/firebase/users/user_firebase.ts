import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";

export class UsersFirebaseService {
  private auth = getAuth();

  async getUser(): Promise<User | null> {
    return this.auth.currentUser;
  }

  async createUser(
    name: string,
    email: string,
    password: string
  ): Promise<UserCredential> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      const user = userCredential.user;

      if (user) {
        await updateProfile(user, {
          displayName: name,
        });
        await user.reload();
      }

      return userCredential;
    } catch (error: any) {
      const message =
        error?.message || "Erro desconhecido ao criar o usuário.";
      const code = error?.code || "ERROR_CREATE_USER";

      throw new Error(`(${code}) ${message}`);
    }
  }
}
