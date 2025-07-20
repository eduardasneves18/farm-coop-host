import { format } from "date-fns";
import { FirebaseServiceGeneric } from "../FirebaseServiceGeneric";
import { ProductsCacheService } from "@/services/cache/products/product_cache_service";
import { UsersFirebaseService } from "../users/user_firebase";

export class SalesFirebaseService {
  private firebaseService = new FirebaseServiceGeneric();
  private cacheService = new ProductsCacheService();
  private usersService = new UsersFirebaseService();

  private lastSaleId: string = "";
  private startAt: number = 0;
  private pageSize: number = 7;
  public executeSublist: boolean = false;

  async createSale({
    productId,
    productName,
    quantity,
    value,
    unit,
    clientName,
    paymentMethod,
    date,
  }: {
    productId: string;
    productName: string;
    quantity: number;
    value: number;
    unit: string;
    clientName: string;
    paymentMethod?: string;
    date: string;
  }): Promise<void> {
    try {
      const user = await this.usersService.getUser();
      if (!user) throw new Error("Nenhum usuário autenticado");

      const userId = user.uid;

      await this.firebaseService.create("sales", {
        usuario_id: userId,
        product_id: productId,
        product_name: productName,
        quantity,
        value,
        unit,
        client_name: clientName,
        payment_method: paymentMethod || "Não informado",
        date,
      });

      await this.cacheService.clearCache();

      const sales = await this.getSalesPagination(userId, {
        lastSaleId: this.lastSaleId,
      });
      await this.cacheService.saveProducts(sales);
    } catch (e: any) {
      throw new Error(`Erro ao registrar venda: ${e.message || e}`);
    }
}

  async getSales(productId?: string): Promise<Record<string, any>[]> {
    const snapshot = await this.firebaseService.fetch("sales");
    const sales: Record<string, any>[] = [];

    if (snapshot.exists()) {
      const data = snapshot.val() as Record<string, any>;

      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (!productId || value.product_id === productId) {
            sales.push({
              saleId: key,
              ...value,
            });
          }
        }
      }

      // Ordena as vendas pela data mais recente primeiro
      sales.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
    }

    return sales;
  }

  async updateSale(
    saleId: string,
    data: Record<string, any>,
    sales: Record<string, any>[]
  ): Promise<void> {
    try {
      await this.firebaseService.update("sales", saleId, data);

      const index = sales.findIndex((s) => s.saleId === saleId);
      if (index !== -1) {
        sales[index] = { ...sales[index], ...data };
        await this.cacheService.saveProducts(sales);
      }
    } catch (e: any) {
      throw new Error(`Erro ao atualizar venda: ${e.message || e}`);
    }
  }

  async deleteSale(
    saleId: string,
    sales: Record<string, any>[]
  ): Promise<void> {
    try {
      await this.firebaseService.delete("sales", saleId);
      const filtered = sales.filter((s) => s.saleId !== saleId);
      await this.cacheService.saveProducts(filtered);
    } catch (e: any) {
      throw new Error(`Erro ao deletar venda: ${e.message || e}`);
    }
  }

  /**
   * Retorna uma página de vendas paginadas.
   * Caso executeSublist seja false e startAt > 0, retorna lista vazia.
   */
  async getSalesPagination(
    usuarioId: string,
    options: { lastSaleId?: string } = {}
  ): Promise<Record<string, any>[]> {
    try {
      if (!this.executeSublist && this.startAt > 0) return [];

      let sales = await this.getSales();

      // Se veio um novo lastSaleId, atualiza a paginação
      if (options.lastSaleId && options.lastSaleId !== this.lastSaleId) {
        this.lastSaleId = options.lastSaleId;
        this.startAt += this.pageSize;
      }

      if (this.executeSublist && this.startAt < sales.length) {
        sales = sales.slice(this.startAt, this.startAt + this.pageSize);
      }

      return sales;
    } catch (e) {
      console.error("Erro na paginação de vendas:", e);
      return [];
    }
  }

  /**
   * Retorna a primeira ocorrência da propriedade especificada em vendas de um produto.
   */
  async getSalesProps(
    productId: string,
    prop: string
  ): Promise<string | null> {
    try {
      const productSales = await this.getSales(productId);
      if (productSales.length > 0 && prop in productSales[0]) {
        return productSales[0][prop];
      }
    } catch (e) {
      console.error("Erro ao buscar propriedade de venda:", e);
    }
    return null;
  }
}
