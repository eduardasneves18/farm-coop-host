import { User } from "firebase/auth";
import { DatabaseReference, get, child } from "firebase/database";
import { UsersFirebaseService } from "../users/user_firebase";
import { ProductsCacheService } from "@/services/cache/products/product_cache_service";
import { FirebaseServiceGeneric } from "../FirebaseServiceGeneric";

export class ProductsFirebaseService {
  private firebaseService = new FirebaseServiceGeneric();
  private cacheService = new ProductsCacheService();
  private usersService = new UsersFirebaseService();

  private lastProductId = "";
  private startAt = 0;
  private endAt = 7;
  private executeSublist = false;

  async createProduct({
    nome,
    precoCusto,
    precoVenda,
    lucro,
    percentualLucro,
    unidadeMedida,
    quantidadeDisponivel,
  }: {
    nome: string;
    precoCusto: number;
    precoVenda: number;
    lucro: number;
    percentualLucro: number;
    unidadeMedida: string;
    quantidadeDisponivel: number;
  }) {
    try {
      const user: User | null = await this.usersService.getUser();
      if (!user) throw new Error("Nenhum usuário autenticado");

      const userId = user.uid;

      await this.firebaseService.create("products", {
        usuario_id: userId,
        nome,
        preco_custo: precoCusto,
        preco_venda: precoVenda,
        lucro,
        percentual_lucro: percentualLucro,
        unidade_medida: unidadeMedida,
        quantidade_disponivel: quantidadeDisponivel,
      });

      await this.cacheService.clearCache();

      const products = await this.getProductsPagination(userId, {
        lastProductId: this.lastProductId,
      });

      await this.cacheService.saveProducts(products);
    } catch (e) {
      throw new Error("Erro ao criar produto: " + e);
    }
  }

  async getProducts(productId?: string): Promise<Array<Record<string, any>>> {
    const snapshot = await this.firebaseService.fetch("products");
    const products: Array<Record<string, any>> = [];

    if (snapshot && snapshot.val()) {
      const dados = snapshot.val();
      for (const key in dados) {
        const value = dados[key];
        if (!productId || key === productId) {
          products.push({
            productId: key,
            nome: value.nome,
            preco_custo: value.preco_custo,
            preco_venda: value.preco_venda,
            lucro: value.lucro,
            percentual_lucro: value.percentual_lucro,
            unidade_medida: value.unidade_medida,
            quantidade_disponivel: value.quantidade_disponivel,
          });
        }
      }

      products.sort((a, b) =>
        a.nome.toString().localeCompare(b.nome.toString())
      );
    }

    return products;
  }

  async updateProduct(
    productId: string,
    data: Record<string, any>,
    products: Array<Record<string, any>>
  ) {
    await this.firebaseService.update("products", productId, data);

    const index = products.findIndex((p) => p.productId === productId);
    if (index !== -1) {
      products[index] = { ...data, productId };
      await this.cacheService.saveProducts(products);
    }
  }

  async updateProductQuantity(id: string, novaQuantidade: number) {
    await this.firebaseService.update("products", id, {
      quantidade_disponivel: novaQuantidade,
    });
  }

  async deleteProduct(
    productId: string,
    products: Array<Record<string, any>>
  ) {
    await this.firebaseService.delete("products", productId);
    const updated = products.filter((p) => p.productId !== productId);
    await this.cacheService.saveProducts(updated);
  }

  async getProductsFiltered({
    nome,
    precoCusto,
    precoVenda,
    percentualLucro,
  }: {
    nome?: string;
    precoCusto?: number;
    precoVenda?: number;
    percentualLucro?: number;
  }): Promise<Array<Record<string, any>>> {
    const user = await this.usersService.getUser();
    if (!user) throw new Error("Usuário não autenticado");

    let products = await this.getProducts();

    if (nome) {
      products = products.filter((p) =>
        p.nome.toLowerCase().includes(nome.toLowerCase())
      );
    }
    if (precoCusto !== undefined) {
      products = products.filter((p) => p.preco_custo === precoCusto);
    }
    if (precoVenda !== undefined) {
      products = products.filter((p) => p.preco_venda === precoVenda);
    }
    if (percentualLucro !== undefined) {
      products = products.filter((p) => p.percentual_lucro === percentualLucro);
    }

    return products;
  }

  async getProductsPagination(
    usuarioId: string,
    {
      lastProductId,
    }: {
      lastProductId?: string;
    } = {}
  ): Promise<Array<Record<string, any>>> {
    try {
      if (!this.executeSublist && this.startAt > 0) return [];

      let products = await this.getProducts();

      if (lastProductId && lastProductId !== this.lastProductId) {
        this.lastProductId = lastProductId;
        this.startAt += 7;
        this.endAt += 7;
      }

      if (this.executeSublist && this.startAt < products.length) {
        products = products.slice(
          this.startAt,
          Math.min(this.endAt, products.length)
        );
      }

      return products;
    } catch (e) {
      console.error("Erro na paginação de produtos:", e);
      return [];
    }
  }

  async getProductsProps(
    productId: string,
    prop: string
  ): Promise<string | null> {
    try {
      const product = await this.getProducts(productId);
      if (product.length > 0) {
        return product[0][prop]?.toString() ?? null;
      }
    } catch (e) {
      console.error("Erro ao buscar propriedade do produto:", e);
    }
    return null;
  }
}
