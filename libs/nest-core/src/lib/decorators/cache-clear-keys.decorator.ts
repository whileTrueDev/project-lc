import { CustomDecorator, SetMetadata } from '@nestjs/common';
import { CACHE_CLEAR_KEY_METADATA } from '../constants/cache-clear-key';

export const CacheClearKeys = (...cacheClearKeys: string[]): CustomDecorator<string> =>
  SetMetadata(CACHE_CLEAR_KEY_METADATA, cacheClearKeys);
