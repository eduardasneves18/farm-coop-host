import { GenericCacheService } from '../generic_cache_service';

export class GoalsCacheService extends GenericCacheService {
  constructor() {
    super('goals_cache');
  }
}
