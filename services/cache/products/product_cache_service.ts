export class ProductsCacheService {
  private productsCache: Array<Record<string, any>> | null = null;

  async saveProducts(products: Array<Record<string, any>>): Promise<void> {
    this.productsCache = [...products];
  }

  async getProducts(): Promise<Array<Record<string, any>>> {
    return this.productsCache ?? [];
  }

  async clearCache(): Promise<void> {
    this.productsCache = null;
  }
}
