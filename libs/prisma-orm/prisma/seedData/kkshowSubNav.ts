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
        link: '/goods/4',
        name: '4번상품',
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
      {
        index: 6,
        link: '/bc',
        name: '방송인목록',
      },
    ],
  });
};
