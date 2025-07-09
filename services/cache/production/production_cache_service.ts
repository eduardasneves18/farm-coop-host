import { GenericCacheService } from "../generic_cache_service";


export class ProductionsCacheService extends GenericCacheService {
  constructor() {
    super('productions_cache');
  }
}
