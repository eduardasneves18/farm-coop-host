import { ProductsCacheService } from "@/services/cache/products/product_cache_service";
import { Auth } from "firebase/auth";
import clienteStore, { Cliente } from "@/store/client_store";

export class SessionManager {
  private static readonly sessionTimeout = 1000 * 60 * 1000;
  private sessionTimer: ReturnType<typeof setTimeout> | null = null;
  private auth: Auth;
  private user: Cliente;
  private cacheService = new ProductsCacheService();

  constructor(
    auth: Auth,
    user: Cliente
  ) {
    this.auth = auth;
    this.user = user;
    this.startSessionTimer();
    this.setUser();
  }

  private startSessionTimer() {
    if (this.sessionTimer) clearTimeout(this.sessionTimer);
    this.sessionTimer = setTimeout(() => this.handleSessionTimeout(), SessionManager.sessionTimeout);
  }

  resetSessionTimer() {
    this.startSessionTimer();
  }

  private setUser() {
    clienteStore.defineCliente(this.user);
  }

  private clearUser() {
    clienteStore.removeCliente();
  }

  private async handleSessionTimeout() {
    await this.logout();
  }

  async logout() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
    await this.auth.signOut();
    this.clearUser();
    await this.cacheService.clearCache();
  }

  dispose() {
    if (this.sessionTimer) {
      clearTimeout(this.sessionTimer);
      this.sessionTimer = null;
    }
  }
}
