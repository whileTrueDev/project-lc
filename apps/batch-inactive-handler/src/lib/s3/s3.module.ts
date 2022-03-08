import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3Service } from './s3.service';
import { validationSchema } from '../../settings/config.validation';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema })],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
