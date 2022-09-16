import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Customer, Prisma } from '@prisma/client';
import { ImageResizer, UserPwManager } from '@project-lc/nest-core';
import { PrismaService } from '@project-lc/prisma-orm';
import {
  CustomerStatusRes,
  SignUpDto,
  UpdateCustomerDto,
} from '@project-lc/shared-types';
import { getOrderItemOptionSteps } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class CustomerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly pwManager: UserPwManager,
    private readonly imageResizer: ImageResizer,
  ) {}

  /** 소비자 생성 (회원가입) */
  public async signUp(dto: SignUpDto): Promise<Customer> {
    const hashedPw = await this.pwManager.hashPassword(dto.password);
    try {
      const created = await this.prisma.customer.create({
        data: {
          email: dto.email,
          password: hashedPw,
          nickname: dto.nickname || '',
          name: dto.name,
          agreementFlag: true,
        },
      });
      return created;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002')
          throw new BadRequestException('이미 가입한 이메일입니다.');
      }
      throw e;
    }
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
    let take;
    let skip;
    let orderBy;
    let include;
    if (opts) {
      take = opts.take || undefined;
      skip = opts.skip || undefined;
      orderBy = opts.orderBy || undefined;
      include = opts.include || undefined;
    }

    return this.prisma.customer.findMany({ take, skip, orderBy, include });
  }

  /** 소비자 정보 수정 */
  public async update(
    customerId: Customer['id'],
    dto: UpdateCustomerDto,
  ): Promise<Customer> {
    /* eslint no-param-reassign: "error" */
    if (dto.birthDate) {
      dto.birthDate = new Date(dto.birthDate);
    }
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

  /**
   * 소비자 이메일 주소가 중복되는 지 체크합니다.
   * @param email 중복체크할 이메일 주소
   * @returns {boolean} 중복되지않아 괜찮은 경우 true, 중복된 경우 false
   */
  async isEmailDupCheckOk(email: string): Promise<boolean> {
    const user = await this.prisma.customer.findFirst({ where: { email } });
    // inactiveCustomer 테이블 생성 이후 작업
    // const inactiveUser = await this.prisma.inactiveBroadcaster.findFirst({
    //   where: { email },
    // });
    // if (user || inactiveUser) return false;
    if (user) return false;
    return true;
  }

  /**
   * 비밀번호 변경
   * @param email 비밀번호 변경할 소비자의 email
   * @param newPassword 새로운 비밀번호
   * @returns
   */
  async changePassword(email: string, newPassword: string): Promise<Customer> {
    const hashedPw = await this.pwManager.hashPassword(newPassword);
    const customer = await this.prisma.customer.update({
      where: { email },
      data: {
        password: hashedPw,
      },
    });
    return customer;
  }

  /** 소비자 마이페이지 홈 상태(팔로잉, 라이브알림, 배송중)표시 위한 정보 리턴 */
  async getCustomerStatus({
    customerId,
  }: {
    customerId: number;
  }): Promise<CustomerStatusRes> {
    const customer = await this.prisma.customer.findFirst({
      where: { id: customerId },
      select: {
        nickname: true,
        _count: {
          select: { followingBroadcasters: true, followingLiveShoppings: true },
        },
        orders: {
          include: {
            orderItems: {
              select: { options: { select: { step: true } } },
            },
          },
        },
      },
    });
    if (!customer)
      throw new BadRequestException(
        `해당 소비자가 존재하지 않습니다 고유번호 : ${customerId}`,
      );

    // 닉네임
    const nickname = customer.nickname || undefined;
    // 팔로잉중인 방송인 수, 팔로잉중인 라이브쇼핑 개수
    const { followingBroadcasters, followingLiveShoppings } = customer._count;
    // 배송중인 주문 개수
    const shippingOrders = customer.orders.filter((order) => {
      const orderItemOptionSteps = getOrderItemOptionSteps(order);
      return orderItemOptionSteps.some((oios) =>
        ['shipping', 'partialShipping'].includes(oios),
      );
    }).length;
    return {
      id: customerId,
      nickname,
      followingBroadcasters,
      followingLiveShoppings,
      shippingOrders,
    };
  }

  /** 소비자 아바타 이미지 url 저장 */
  public async addCustomerAvatar(
    email: Customer['email'],
    file: Express.Multer.File,
  ): Promise<boolean> {
    const avatarUrl = await s3.uploadProfileImage({
      key: file.originalname,
      file: file.buffer,
      email,
      userType: 'customer',
    });
    await this.prisma.customer.update({
      where: { email },
      data: { avatar: avatarUrl },
    });
    return true;
  }

  /** 소비자 아바타 이미지 url null 로 초기화 */
  public async removeCustomerAvatar(email: Customer['email']): Promise<boolean> {
    await this.prisma.customer.update({
      where: { email },
      data: { avatar: null },
    });
    return true;
  }
}
