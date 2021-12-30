import { Global, Module } from '@nestjs/common';
import { CipherService } from './cipher.service';

@Global()
@Module({
  providers: [CipherService],
  exports: [CipherService],
})
export class CipherModule {}
