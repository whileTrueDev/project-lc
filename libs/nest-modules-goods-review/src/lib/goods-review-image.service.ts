import { BadRequestException, Injectable } from '@nestjs/common';
import { GoodsReview, GoodsReviewImage } from '@prisma/client';
import { PrismaService } from '@project-lc/prisma-orm';
import { s3 } from '@project-lc/utils-s3';

@Injectable()
export class GoodsReviewImageService {
  constructor(private readonly prisma: PrismaService) {}

  /** S3 등록된 리뷰이미지 삭제 */
  public async removeS3Image(
    imageUrls: GoodsReviewImage['imageUrl'][],
  ): Promise<boolean> {
    if (imageUrls.length <= 0) return false;
    // s3 등록된 이미지 삭제
    const s3ReviewImageKeys = imageUrls.map((img) => {
      if (img.includes(s3.bucketDomain)) {
        return img.replace(s3.bucketDomain, '');
      }
      return img;
    });
    return s3.sendDeleteObjectsCommand({
      deleteObjects: s3ReviewImageKeys.map((Key) => ({ Key })),
    });
  }

  /** 개별 리뷰 이미지 삭제 */
  public async remove(id: GoodsReviewImage['id']): Promise<boolean> {
    let result: GoodsReviewImage;
    try {
      result = await this.prisma.goodsReviewImage.delete({ where: { id } });
    } catch (err) {
      throw new BadRequestException(`GoodsReviewImage ${id} not found`);
    }

    await this.removeS3Image([result.imageUrl]);
    return !!result;
  }

  /** 여러 리뷰이미지 삭제 */
  public async removeImages(reviewImages: GoodsReviewImage[]): Promise<boolean> {
    if (reviewImages.length <= 0) return false;
    const reviewImageIds = reviewImages.map((i) => i.id);
    await this.prisma.goodsReviewImage.deleteMany({
      where: { id: { in: reviewImageIds } },
    });
    await this.removeS3Image(reviewImages.map((i) => i.imageUrl));
    return true;
  }

  /** 특정 리뷰의 모든 이미지 삭제 */
  public async removeAllImageByReviewId(
    goodsReviewId: GoodsReview['id'],
  ): Promise<boolean> {
    const images = await this.prisma.goodsReviewImage.findMany({
      where: { goodsReviewId },
    });
    if (images.length <= 0) return false;

    await this.prisma.goodsReviewImage.deleteMany({
      where: { goodsReviewId },
    });
    await this.removeS3Image(images.map((i) => i.imageUrl));
    return true;
  }

  /** 특정 imageUrl을 가진 모든 이미지 삭제 */
  public async removeByImageUrl(
    imageUrl: GoodsReviewImage['imageUrl'],
  ): Promise<boolean> {
    const images = await this.prisma.goodsReviewImage.findMany({ where: { imageUrl } });
    if (images.length <= 0) return false;
    await this.prisma.goodsReviewImage.deleteMany({ where: { imageUrl } });
    return this.removeS3Image(images.map((i) => i.imageUrl));
  }
}
