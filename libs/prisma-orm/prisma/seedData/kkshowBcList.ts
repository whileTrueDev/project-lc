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
      {
        id: 6,
        nickname: '음바쿠TV',
        profileImage: 'https://picsum.photos/302/301',
        href: '/bc/1',
        broadcasterId: 1,
      },
      {
        id: 7,
        nickname: '테스트방송인닉네임',
        profileImage: 'https://picsum.photos/300/300',
        href: '/bc/2',
        broadcasterId: 2,
      },
      {
        id: 8,
        nickname: '한동숙',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/c5a2baa2-74ed-4b72-b047-8326572c9bfa-profile_image-300x300.png',
        href: 'https://www.twitch.tv/handongsuk',
      },
      {
        id: 9,
        nickname: '서새봄냥',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/saddummy-profile_image-925b92caa01026ae-300x300.jpeg',
        href: 'https://www.twitch.tv/saddummy',
      },
      {
        id: 10,
        nickname: '얍얍',
        profileImage:
          'https://static-cdn.jtvnw.net/jtv_user_pictures/dbb514f1-469b-479e-b5ba-3ac0f09a2776-profile_image-300x300.png',
        href: 'https://www.twitch.tv/yapyap30',
      },
    ],
  });
};
