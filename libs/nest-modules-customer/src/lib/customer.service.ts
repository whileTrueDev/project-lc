import {
  BadRequestException,
  CACHE_MANAGER,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { ServiceBaseWithCache, UserPwManager } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import { SignUpDto, UpdateCustomerDto } from '@project-lc/shared-types';
import { Cache } from 'cache-manager';

@Injectable()
export class CustomerService extends ServiceBaseWithCache {
  #CUSTOMER_CACHE_KEY = 'customer';

  constructor(
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
    private readonly prisma: PrismaService,
    private readonly pwManager: UserPwManager,
  ) {
    super(cacheManager);
  }

  /** 소비자 생성 (회원가입) */
  public async signUp(dto: SignUpDto): Promise<Customer> {
    const hashedPw = await this.pwManager.hashPassword(dto.password);
    const created = await this.prisma.customer.create({
      data: { email: dto.email, password: hashedPw, nickname: '', name: dto.name },
    });
    await this._clearCaches(this.#CUSTOMER_CACHE_KEY);
    return created;
  }

  /** 소비자 1명 정보 조회 */
  public async findOne({
    id,
    email,
  }: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    return this.prisma.customer.findUnique({ where: { id, email } });
  }

  /** 휴면 중 소비자 1명 정보 조회 */
  public async findInactiveOne({
    id,
    email,
  }: Prisma.CustomerWhereUniqueInput): Promise<Customer> {
    // return this.prisma.inactiveCustomer.findUnique({ where: { id, email } });
    return this.prisma.customer.findUnique({ where: { id, email } });
  }

  /** 모든 소비자 정보 조회 */
  public async findAll(opts?: Prisma.CustomerFindManyArgs): Promise<Customer[]> {
    const { take, skip, orderBy } = opts;
    return this.prisma.customer.findMany({ take, skip, orderBy });
  }

  /** 소비자 정보 수정 */
  public async update(
    customerId: Customer['id'],
    dto: UpdateCustomerDto,
  ): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id: customerId },
      data: dto,
    });
  }

  /** 소비자 정보 삭제 */
  public async deleteOne(customerId: Customer['id']): Promise<boolean> {
    const result = await this.prisma.customer.delete({
      where: { id: customerId },
    });
    return !!result;
  }

  /** 소비자 비밀번호 맞는 지 조회 */
  public async checkPassword(
    email: Customer['email'],
    pw: Customer['password'],
  ): Promise<boolean> {
    const customer = await this.findOne({ email });
    return this.pwManager.checkPassword(customer, pw);
  }

  /** 소비자 로그인 */
  public async login(email: string, pwdInput: string): Promise<Customer> {
    const customer = await this.findOne({ email });
    // 등록되지 않은 email의 경우
    if (!customer) throw new UnauthorizedException('user not found');
    // 소셜로그인으로 가입되고 아직 비밀번호를 지정하지 않은 소비자의 경우
    if (customer.password === null)
      throw new BadRequestException('social user - empty password ');

    const isCorrect = await this.pwManager.validatePassword(pwdInput, customer.password);
    // 비밀번호가 틀린 경우
    if (!isCorrect) throw new UnauthorizedException('incorrect password');
    // 올바른 이메일, 비밀번호 입력시
    return customer;
  }
}
