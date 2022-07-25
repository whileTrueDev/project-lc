import { PrismaClient } from '@prisma/client';

export const createKkshowSubNavDummy = async (prisma: PrismaClient): Promise<void> => {
  await prisma.kkshowSubNavLink.createMany({
    data: [
      {
        index: 1,
        link: '/goods/1',
        name: '1번상품',
      },
      {
        index: 2,
        link: 'https://naver.com',
        name: '네이버',
      },
      {
        index: 3,
        link: 'https://www.google.co.kr/',
        name: '구글',
      },
      {
        index: 4,
        link: '/mypage',
        name: '마이페이지',
      },
      {
        index: 5,
        link: '/search?keyword=asdfasdfasdf',
        name: '검색페이지',
      },
    ],
  });
};
