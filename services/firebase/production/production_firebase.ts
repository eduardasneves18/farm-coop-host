import { ProductionsCacheService } from "@/services/cache/production/production_cache_service";
import { FirebaseServiceGeneric } from "../FirebaseServiceGeneric";
import { UsersFirebaseService } from "../users/user_firebase";

type ProductionItem = {
  id?: string;
  produto: string;
  quantidade: number;
  unidadeMedida: string;
  status: string;
  dataEstimadaColheita: string;
  timestamp: string;
};

export class ProductionFirebaseService {
  private firebaseService = new FirebaseServiceGeneric();
  private usersService = new UsersFirebaseService();
  private cacheService = new ProductionsCacheService();

  async createProductionItem({
    produto,
    quantidade,
    unidadeMedida,
    status,
    dataEstimadaColheita,
  }: {
    produto: string;
    quantidade: number;
    unidadeMedida: string;
    status: string;
    dataEstimadaColheita: string;
  }): Promise<void> {
    try {
      const user = await this.usersService.getUser();
      if (!user) throw new Error("Nenhum usuário autenticado");

      await this.firebaseService.create("production", {
        usuario_id: user.uid,
        produto,
        quantidade,
        unidadeMedida,
        status,
        dataEstimadaColheita: dataEstimadaColheita,
        timestamp: new Date().toISOString(),
      });

      await this.cacheService.clear();
    } catch (e: any) {
      throw new Error(`Erro ao criar item de produção: ${e.message || e}`);
    }
  }

  async getProductionItems(productId?: string): Promise<ProductionItem[]> {
    await this.cacheService.clear();

    let items = (await this.cacheService.get()) as ProductionItem[];

    if (!items || items.length === 0) {
      const snapshot = await this.firebaseService.fetch("productions");
      items = [];

      if (snapshot && snapshot.val()) {
        const data = snapshot.val() as Record<string, any>;

        for (const key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            const value = data[key];
            if (!productId || value.produto === productId) {
              items.push({
                id: key,
                produto: value.produto,
                quantidade: value.quantidade,
                unidadeMedida: value.unidade,
                status: value.status,
                dataEstimadaColheita: value.data_estimada,
                timestamp: value.created_at,
              });
            }
          }
        }

        items.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
        await this.cacheService.save(items);
      }
    }

    return items;
  }

  async updateProductionItem(
    id: string,
    data: Partial<ProductionItem>
  ): Promise<void> {
    await this.firebaseService.update("production", id, data);
    await this.cacheService.clear();
  }

  async deleteProductionItem(id: string): Promise<void> {
    await this.firebaseService.delete("production", id);
    await this.cacheService.clear();
  }

  async filterByStatus(status: string): Promise<ProductionItem[]> {
    const user = await this.usersService.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    const allItems = await this.getProductionItems();
    return allItems.filter((item) => item.status === status);
  }

  async getProductionProp(
    productId: string,
    prop: keyof ProductionItem
  ): Promise<any | null> {
    try {
      const production = await this.getProductionItems(productId);
      if (production.length > 0) {
        return production[0][prop];
      }
    } catch (e) {
      console.error("Erro ao buscar propriedade de produção:", e);
    }
    return null;
  }
}
