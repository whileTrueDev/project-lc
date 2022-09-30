import { PrismaClient } from '@prisma/client';

export const createKkshowLiveEmbedDummy = async (prisma: PrismaClient): Promise<void> => {
  await prisma.liveShoppingEmbed.create({
    data: {
      streamingService: 'twitch',
      UID: 'chodan_',
      liveShopping: { connect: { id: 1 } },
    },
  });
};
