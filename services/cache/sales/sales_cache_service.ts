import { GenericCacheService } from '../generic_cache_service';

export class SalesCacheService extends GenericCacheService {
  constructor() {
    super('sales_cache');
  }
}
