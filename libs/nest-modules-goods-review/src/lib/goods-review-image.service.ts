import { BadRequestException, Injectable } from '@nestjs/common';
import { GoodsReview, GoodsReviewImage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class GoodsReviewImageService {
  constructor(private readonly prisma: PrismaService) {}

  /** 개별 리뷰 이미지 삭제 */
  public async remove(id: GoodsReview['id']): Promise<boolean> {
    let result: GoodsReviewImage;
    try {
      result = await this.prisma.goodsReviewImage.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(`GoodsReviewImage ${id} not found`);
    }

    const url = result.imageUrl;
    if (url.includes(s3.fullDomain)) {
      const Key = url.replace(s3.fullDomain, '');
      await s3.sendDeleteObjectsCommand({ deleteObjects: [{ Key }] });
    }

    return !!result;
  }

  public async removeByImageUrl(
    imageUrl: GoodsReviewImage['imageUrl'],
  ): Promise<boolean> {
    const images = await this.prisma.goodsReviewImage.findMany({ where: { imageUrl } });
    await this.prisma.goodsReviewImage.deleteMany({ where: { imageUrl } });

    Promise.all(
      images.map(async (image) => {
        const url = image.imageUrl;
        if (url.includes(s3.fullDomain)) {
          const Key = url.replace(s3.fullDomain, '');
          return s3.sendDeleteObjectsCommand({ deleteObjects: [{ Key }] });
        }
        return image.imageUrl;
      }),
    );
    return true;
  }
}
