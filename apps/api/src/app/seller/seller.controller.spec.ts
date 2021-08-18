import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Seller } from '@prisma/client';
import { PrismaModule } from '@project-lc/prisma-orm';
import request from 'supertest';
import { JwtConfigService } from '../../settings/jwt.setting';
import { mailerConfig } from '../../settings/mailer.config';
import { AuthModule } from '../auth/auth.module';
import { SellerController } from './seller.controller';
import { SellerService } from './seller.service';

describe('SellerController', () => {
  let app: NestApplication;
  let controller: SellerController;

  const user: Seller = {
    id: 1,
    name: 'tester',
    email: 'test@test.com',
    password: 'test',
  };
  const service = { findOne: async () => Promise.resolve(user) };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AuthModule,
        PrismaModule,
        MailerModule.forRoot(mailerConfig),
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useClass: JwtConfigService,
        }),
      ],
    })
      .overrideProvider(SellerService)
      .useValue(service)
      .compile();

    controller = module.get<SellerController>(SellerController);

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    return app.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /seller :: findOne', () => {
    it('should return 200', (done) => {
      request(app.getHttpServer())
        .get('/seller?email=test@test.com')
        .expect(200)
        .expect(user, done);
    });

    it('should return 400', () => {
      request(app.getHttpServer()).get('/seller').expect(400);
    });
  });
});
