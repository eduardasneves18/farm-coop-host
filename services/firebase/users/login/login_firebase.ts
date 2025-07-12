import { app } from "@/FirebaseConfig";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";

export class LoginFirebaseAuthService {
  private auth = getAuth(app);

  async signInWithEmailPassword(
    email: string,
    senha: string
  ): Promise<User | null> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        senha
      );

      return userCredential.user;
    } catch (e: any) {
      if (e.code) {
        throw new Error(`(${e.code}) ${e.message ?? "Erro ao autenticar."}`);
      }

      throw new Error(`Erro desconhecido ao fazer login: ${e}`);
    }
  }

  async signOut(): Promise<void> {
    await signOut(this.auth);
  }
}
