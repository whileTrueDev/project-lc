import {
  CACHE_MANAGER,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { GoodsInfo } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsInfoDto } from '@project-lc/shared-types';
import {
  getImgSrcListFromHtmlStringList,
  getS3KeyListFromImgSrcList,
  S3Service,
} from '@project-lc/nest-modules-s3';
import { ServiceBaseWithCache } from '@project-lc/nest-core';
import { Cache } from 'cache-manager';

@Injectable()
export class GoodsCommonInfoService extends ServiceBaseWithCache {
  #GOODS_CACHE_KEY = 'goods';
  #GOODS_COMMON_INFO_CACHE_KEY = 'goods/common-info';

  constructor(
    private readonly prisma: PrismaService,
    private readonly s3service: S3Service,
    @Inject(CACHE_MANAGER) protected readonly cacheManager: Cache,
  ) {
    super(cacheManager);
  }

  /** 상품 공통정보 생성 */
  async registGoodsCommonInfo(
    email: string,
    dto: GoodsInfoDto,
  ): Promise<{
    id: number;
  }> {
    try {
      const item = await this.prisma.goodsInfo.create({
        data: { ...dto, seller: { connect: { email } } },
      });
      await this._clearCaches(this.#GOODS_COMMON_INFO_CACHE_KEY);
      await this._clearCaches(this.#GOODS_CACHE_KEY);
      return { id: item.id };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in registGoodsCommonInfo');
    }
  }

  /** 상품 공통정보 목록 조회 */
  async getGoodsCommonInfoList(email: string): Promise<
    {
      info_name: string;
      id: number;
    }[]
  > {
    try {
      const data = await this.prisma.goodsInfo.findMany({
        where: {
          seller: { email },
        },
        select: {
          id: true,
          info_name: true,
        },
      });
      return data;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error,
        `error in getGoodsCommonInfoList, sellerEmail: ${email}`,
      );
    }
  }

  /** 상품 공통정보 특정 데이터 조회 */
  async getOneGoodsCommonInfo(id: number): Promise<GoodsInfo> {
    try {
      return this.prisma.goodsInfo.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error,
        `error in getOneGoodsCommonInfo, id: ${id}`,
      );
    }
  }

  /** 상품 공통정보 삭제 */
  async deleteGoodsCommonInfo(id: number): Promise<boolean> {
    try {
      // 공통정보 내 포함된 이미지
      const infoContents = await this.prisma.goodsInfo.findUnique({
        where: { id },
        select: {
          info_value: true,
        },
      });

      const contentList = [infoContents.info_value];

      // 각 contents마다 img src 구하기
      const imgSrcList: string[] = getImgSrcListFromHtmlStringList(contentList);

      // img src에서 s3에 저장된 이미지만 찾기
      const s3ImageKeys = getS3KeyListFromImgSrcList(imgSrcList);

      // s3저장된 이미지 있는경우
      if (s3ImageKeys.length > 0) {
        await this.s3service.deleteMultipleObjects(
          s3ImageKeys.map((key) => ({ Key: key })),
        );
      }

      // 공통정보 내 포함된 s3이미지 파일 삭제요청 필요
      await this.prisma.goodsInfo.delete({ where: { id } });
      await this._clearCaches(this.#GOODS_COMMON_INFO_CACHE_KEY);
      await this._clearCaches(this.#GOODS_CACHE_KEY);
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error,
        `error in deleteGoodsCommonInfo, id: ${id}`,
      );
    }
  }
}
