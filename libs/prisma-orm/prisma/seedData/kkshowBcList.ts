import { PrismaClient } from '@prisma/client';

export const createKkshowBcListDummy = async (prisma: PrismaClient): Promise<void> => {
  await prisma.kkshowBcList.createMany({
    data: [
      {
        id: 1,
        href: 'https://www.twitch.tv/chodan_',
        nickname: '쵸단',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-300x300.png',
      },
      {
        id: 2,
        href: 'https://www.twitch.tv/zilioner',
        nickname: '침착맨',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/dde955e8-5fae-44dc-98db-79b3b14afea2-profile_image-300x300.png',
      },
      {
        id: 3,
        href: 'https://www.twitch.tv/gutterlife',
        nickname: '거터',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/567f6252-99a9-46e8-8ba1-de3be899f996-profile_image-300x300.png',
      },
      {
        id: 4,
        href: 'https://www.twitch.tv/109ace',
        nickname: '철면수심',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/80913db2-094f-4f83-83aa-8c0f6926383a-profile_image-300x300.png',
      },
      {
        id: 5,
        href: 'https://www.twitch.tv/llilka',
        nickname: '릴카',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/ae615604-67ff-493f-9d58-45fcae3a659d-profile_image-300x300.png',
      },
    ],
  });
};
