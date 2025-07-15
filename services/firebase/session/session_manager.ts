import { ClienteStore } from '@/store/client_store';
import { Cliente } from '../../../models/cliente';
import { ProductsCacheService } from '../../cache/products/product_cache_service';
import { LoginFirebaseAuthService } from '../users/login/login_firebase';

export class SessionManager {
  private static readonly SESSION_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutos em ms
  private sessionTimerId: ReturnType<typeof setTimeout> | null = null;

  private cacheService = new ProductsCacheService();

  constructor(
    private authService: LoginFirebaseAuthService,
    private user: Cliente,
    private clienteStore: ClienteStore,
  ) {
    this.startSessionTimer();
    this.setUser();
  }

  private startSessionTimer() {
    if (this.sessionTimerId) clearTimeout(this.sessionTimerId);
    this.sessionTimerId = setTimeout(() => this.handleSessionTimeout(), SessionManager.SESSION_TIMEOUT_MS);
  }

  public resetSessionTimer() {
    this.startSessionTimer();
  }

  private setUser() {
    this.clienteStore.defineCliente(this.user);
  }

  private clearUser() {
    this.clienteStore.removeCliente();
  }

  private async handleSessionTimeout() {
    await this.logout();
  }

  public async logout() {
    if (this.sessionTimerId) {
      clearTimeout(this.sessionTimerId);
      this.sessionTimerId = null;
    }
    await this.authService.signOut();
    this.clearUser();
    await this.cacheService.clearCache();
  }

  public dispose() {
    if (this.sessionTimerId) {
      clearTimeout(this.sessionTimerId);
      this.sessionTimerId = null;
    }
  }
}
