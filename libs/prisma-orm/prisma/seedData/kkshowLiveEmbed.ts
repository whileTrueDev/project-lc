import { PrismaClient } from '@prisma/client';

export const createKkshowLiveEmbedDummy = async (prisma: PrismaClient): Promise<void> => {
  await prisma.liveShoppingEmbed.create({
    data: {
      streamingService: 'twitch',
      UID: 'chodan_',
      liveShopping: { connect: { id: 1 } },
    },
  });

  await prisma.liveShoppingVideo.create({
    data: {
      LiveShopping: { connect: { id: 1 } },
      youtubeUrl: 'https://youtu.be/f2a9veJ-dPU',
    },
  });
  await prisma.liveShoppingVideo.create({
    data: {
      LiveShopping: { connect: { id: 2 } },
      youtubeUrl: 'https://youtu.be/SieCvTKXAds',
    },
  });
};
