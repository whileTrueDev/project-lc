import { Broadcaster, PrismaClient } from '@prisma/client';
import { COMMON_DUMMY_PASSWORD } from './dummyData';

export const createDummyBroadcaster = async (
  prisma: PrismaClient,
): Promise<Broadcaster> => {
  return prisma.broadcaster.create({
    data: {
      avatar: 'https://picsum.photos/300/300',
      email: 'testbc2@gmail.com',
      password: COMMON_DUMMY_PASSWORD,
      overlayUrl: `/testbc2@gmail.com`,
      userName: '테스트방송인',
      userNickname: '테스트방송인닉네임',
    },
  });
};
