export abstract class GenericCacheService {
  protected cacheKey: string;

  constructor(cacheKey: string) {
    this.cacheKey = cacheKey;
  }

  async save(items: Array<Record<string, any>>): Promise<void> {
    const itemsJson = items.map(item => JSON.stringify(item));
    localStorage.setItem(this.cacheKey, JSON.stringify(itemsJson));
  }

  async get(): Promise<Array<Record<string, any>>> {
    const data = localStorage.getItem(this.cacheKey);
    if (!data) return [];

    try {
      const itemsJson = JSON.parse(data) as string[];
      return itemsJson.map(item => JSON.parse(item));
    } catch (error) {
      console.error("Erro ao ler cache:", error);
      return [];
    }
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.cacheKey);
  }
}
