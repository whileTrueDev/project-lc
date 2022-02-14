import { Cache } from 'cache-manager';

export class ServiceBaseWithCache {
  constructor(protected readonly cacheManager: Cache) {}

  /**
   * 받은 캐시키에 해당하는 캐시 데이터를 삭제합니다. 해당 캐시키가 포함되는 모든 key에 대해 삭제합니다.
   * @param cacheKey 삭제할 캐시 키
   */
  protected async _clearCaches(cacheKey: string): Promise<boolean> {
    const keys: string[] = await this.cacheManager.store.keys(`*${cacheKey}*`);
    const result = await Promise.all(keys.map((key) => this.cacheManager.del(key))).catch(
      (err) => {
        console.error(`An error occurred during clear caches - ${cacheKey}`, err);
        return false;
      },
    );
    return !!result;
  }
}
