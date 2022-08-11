import { ObjectIdentifier } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoodsInfo } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { GoodsInfoDto } from '@project-lc/shared-types';
import { getImgSrcListFromHtmlStringList } from '@project-lc/utils';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class GoodsCommonInfoService {
  constructor(private readonly prisma: PrismaService) {}

  /** 상품 공통정보 생성 */
  async registGoodsCommonInfo(
    sellerId: number,
    dto: GoodsInfoDto,
  ): Promise<{
    id: number;
  }> {
    try {
      const item = await this.prisma.goodsInfo.create({
        data: { ...dto, seller: { connect: { id: sellerId } } },
      });
      return { id: item.id };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in registGoodsCommonInfo');
    }
  }

  /** 상품 공통정보 목록 조회 */
  async getGoodsCommonInfoList(sellerId: number): Promise<
    {
      info_name: string;
      id: number;
    }[]
  > {
    try {
      const data = await this.prisma.goodsInfo.findMany({
        where: {
          seller: { id: sellerId },
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
        `error in getGoodsCommonInfoList, sellerId: ${sellerId}`,
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
      const s3ImageKeys = s3.getGoodsImageS3KeyListFromImgSrcList(imgSrcList);

      // s3저장된 이미지 있는경우
      if (s3ImageKeys.length > 0) {
        let deleteObjectIdentifiers: ObjectIdentifier[] = [];

        deleteObjectIdentifiers = s3ImageKeys.map((key) => {
          return { Key: key };
        });
        s3.sendDeleteObjectsCommand({ deleteObjects: deleteObjectIdentifiers });
      }

      // 공통정보 내 포함된 s3이미지 파일 삭제요청 필요
      await this.prisma.goodsInfo.delete({ where: { id } });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(
        error,
        `error in deleteGoodsCommonInfo, id: ${id}`,
      );
    }
  }

  /** 상품 공통정보 수정 */
  async updateGoodsCommonInfo(id: number, dto: GoodsInfoDto): Promise<GoodsInfo> {
    try {
      const item = await this.prisma.goodsInfo.update({
        where: { id },
        data: dto,
      });
      return item;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in updateGoodsCommonInfo');
    }
  }
}
