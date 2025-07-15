import { ProductsCacheService } from "@/services/cache/products/product_cache_service";
import { LoginFirebaseAuthService } from "../users/login/login_firebase";
import clienteStore, { Cliente } from "@/store/client_store";

export class SessionManager {
  private static readonly sessionTimeout = 10 * 60 * 1000; // 10 minutos em ms
  private sessionTimer: ReturnType<typeof setTimeout> | null = null;

  private authService: LoginFirebaseAuthService;
  private user: Cliente;
  private cacheService = new ProductsCacheService();

  constructor(
    authService: LoginFirebaseAuthService,
    user: Cliente
  ) {
    this.authService = authService;
    this.user = user;

    this.startSessionTimer();
    this.setUser();
  }

  private startSessionTimer() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    this.sessionTimer = setTimeout(
      () => this.handleSessionTimeout(),
      SessionManager.sessionTimeout
    );
  }

  resetSessionTimer() {
    this.startSessionTimer();
  }

  private setUser() {
    clienteStore.getState().defineCliente(this.user);
  }

  private clearUser() {
    clienteStore.getState().removeCliente();
  }

  private async handleSessionTimeout() {
    await this.logout();
  }

  async logout() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }

    await this.authService.signOut();
    this.clearUser();
    await this.cacheService.clearCache();
  }

  dispose() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
    }
  }
}
