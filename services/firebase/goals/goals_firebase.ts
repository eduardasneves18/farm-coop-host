import { UsersFirebaseService } from '../users/user_firebase';
import { GoalsCacheService } from '../../cache/goals/goals_cache_service';
import { FirebaseServiceGeneric } from '../FirebaseServiceGeneric';

type GoalItem = {
  id?: string;
  tipo: string;
  produto: string;
  valor: number;
  valor_atual: number;
  unidade: string;
  prazo: string;
  timestamp: string;
};

export class GoalsFirebaseService {
  private firebaseService = new FirebaseServiceGeneric();
  private usersService = new UsersFirebaseService();
  private cacheService = new GoalsCacheService();

  async createGoalItem({
    tipo,
    produto,
    valor,
    unidade,
    quantidade,
    prazo,
    usuarioId,
    nome,      
  }: {
    tipo: string;
    produto: string;
    valor: number;
    unidade: string;
    quantidade: number;
    prazo: string;
    usuarioId: string;
    nome: string;
  }): Promise<void> {
    try {
      const user = await this.usersService.getUser();
      if (!user) throw new Error('Nenhum usuário autenticado');

      await this.firebaseService.create('goals', {
        usuario_id: user.uid,
        tipo,
        produto,
        valor,
        valor_atual: 0,
        unidade,
        quantidade,
        prazo,
        timestamp: new Date().toISOString(),
      });

      await this.cacheService.clear();
    } catch (e: any) {
      throw new Error(`Erro ao criar meta: ${e.message || e}`);
    }
  }

  async getGoalItems(productId?: string): Promise<GoalItem[]> {
    let metas = (await this.cacheService.get()) as GoalItem[];

    if (!metas || metas.length === 0) {
      const snapshot = await this.firebaseService.fetch('goals');
      metas = [];

      if (snapshot.exists()) {
        const data = snapshot.val() as Record<string, any>;

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (!productId || value.produto === productId) {
              metas.push({
                id: key,
                tipo: value.tipo,
                produto: value.produto,
                valor: value.valor,
                valor_atual: value.valor_atual,
                unidade: value.unidade,
                prazo: value.prazo,
                timestamp: value.timestamp,
              });
            }
          }
        }

        metas.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        await this.cacheService.save(metas);
      }
    }

    return metas;
  }

  async updateGoalItem(id: string, data: Partial<GoalItem>): Promise<void> {
    await this.firebaseService.update('goals', id, data);
    await this.cacheService.clear();
  }

  async deleteGoalItem(id: string): Promise<void> {
    await this.firebaseService.delete('goals', id);
    await this.cacheService.clear();
  }

  async incrementGoalProgress({
    produto,
    quantidade,
    tipo,
  }: {
    produto: string;
    quantidade: number;
    tipo: string;
  }): Promise<void> {
    const user = await this.usersService.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const metas = await this.getGoalItems();
    for (const meta of metas) {
      if (meta.produto === produto && meta.tipo === tipo) {
        const novoValor = (meta.valor_atual ?? 0) + quantidade;
        if (!meta.id) continue;
        await this.updateGoalItem(meta.id, { valor_atual: novoValor });
      }
    }
  }
}
