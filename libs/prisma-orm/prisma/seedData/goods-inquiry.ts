import { PrismaClient } from '@prisma/client';

export const createGoodsInquiry = async (prisma: PrismaClient): Promise<void> => {
  await prisma.goodsInquiry.create({
    data: {
      content: '문의내용입니다 어떻게 된 일일까요?',
      writerId: 1,
      goodsId: 1,
      status: 'answered',
      comments: {
        create: [
          {
            content: '이러쿵 저러쿵 일입니다. 처리해드리겠습니다.',
            sellerId: 1,
          },
          {
            content: '이러쿵 저러쿵 일입니다2. 처리해드리겠습니다.',
            adminId: 1,
          },
        ],
      },
    },
  });
};

export const createGoodsInquiry2 = async (prisma: PrismaClient): Promise<void> => {
  await prisma.goodsInquiry.create({
    data: {
      content: '문의내용입니다 어떻게 된 일일까요2??',
      writerId: 1,
      goodsId: 2,
      status: 'requested',
    },
  });
};
