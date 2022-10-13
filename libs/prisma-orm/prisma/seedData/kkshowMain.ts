import { PrismaClient } from '@prisma/client';

export const kkshowMainSeedData = {
  carousel: [
    {
      type: 'simpleBanner',
      linkUrl: 'https://www.xn--hp4b17xa.com/goods/12',
      imageUrl:
        'https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-main-carousel-images/1646985653016_배너이미지.jpeg',
      description: '크크쇼 3월 기획전',
    },
    {
      type: 'upcoming',
      imageUrl:
        'https://lc-project.s3.ap-northeast-2.amazonaws.com/live-shopping-images/null/carousel/1646985708035_나무늘봉순홍보물.jpeg',
      normalPrice: 12300,
      liveShoppingId: null,
      productLinkUrl: 'https://smartstore.naver.com/mideun/products/4867304181',
      discountedPrice: 9900,
      productImageUrl:
        'https://shop-phinf.pstatic.net/20220208_193/1644309112479hUb9L_JPEG/45444896009789141_685505840.jpg?type=m510',
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/5f179460-761b-404e-afc6-9ec9ea26df1a-profile_image-70x70.png',
      broadcastEndDate: null,
      liveShoppingName: '봉순늘치킨데이',
      broadcastStartDate: null,
      broadcasterNickname: '',
      liveShoppingProgress: null,
      promotionPageLinkUrl: '',
    },
    {
      type: 'nowPlaying',
      platform: 'twitch',
      videoUrl: 'chodan_',
      normalPrice: 39900,
      liveShoppingId: null,
      productLinkUrl: 'https://www.xn--hp4b17xa.com/goods/12',
      discountedPrice: 29900,
      productImageUrl:
        'https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665%40naver.com/220708165548_%EB%8B%AD%EA%BC%AC%EC%B9%981.jpg',
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-70x70.png',
      broadcastEndDate: null,
      liveShoppingName: '해피쵸이어',
      broadcastStartDate: null,
      broadcasterNickname: '',
      liveShoppingProgress: null,
      promotionPageLinkUrl: '',
    },
    {
      type: 'previous',
      videoUrl: 'vFv6ZUOEnAo',
      normalPrice: 20000,
      liveShoppingId: null,
      productLinkUrl: 'https://www.xn--hp4b17xa.com/goods/12',
      discountedPrice: 10000,
      productImageUrl:
        'https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665%40naver.com/220708164922_%EC%96%91%EB%85%90+%EB%AC%B4%EB%BC%88%EB%8B%AD%EB%B0%9C2.jpg',
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/a27144c9-0c62-46e4-a7a8-9b51b394567a-profile_image-70x70.png',
      broadcastEndDate: null,
      liveShoppingName: ' 수련수련 x 크크쇼 라이브',
      broadcastStartDate: null,
      broadcasterNickname: '',
      liveShoppingProgress: null,
      promotionPageLinkUrl: '',
    },
    {
      type: 'previous',
      videoUrl: 'TutKdpA-JRw',
      normalPrice: 20000,
      liveShoppingId: null,
      productLinkUrl: 'https://www.xn--hp4b17xa.com/goods/12',
      discountedPrice: 10000,
      productImageUrl:
        'https://lc-project.s3.ap-northeast-2.amazonaws.com/goods/3533665%40naver.com/220708164922_%EC%96%91%EB%85%90+%EB%AC%B4%EB%BC%88%EB%8B%AD%EB%B0%9C2.jpg',
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/ec949373-7065-423c-afad-08f9504c8034-profile_image-150x150.png',
      broadcastEndDate: null,
      liveShoppingName: '연나비 x 크크쇼 라이브',
      broadcastStartDate: null,
      broadcasterNickname: '',
      liveShoppingProgress: null,
      promotionPageLinkUrl: '',
    },
  ],
  trailer: {
    imageUrl:
      'https://lc-project.s3.ap-northeast-2.amazonaws.com/live-shopping-images/undefined/trailer/1646985740614_민결희.jpeg',
    normalPrice: 19000,
    productLinkUrl: 'https://www.xn--hp4b17xa.com/goods/12',
    discountedPrice: 14900,
    liveShoppingName: '민결희 x 예스닭강정',
    broadcastStartDate: '2022-02-20T04:00:00.000Z',
    broadcasterNickname: '민결희',
    broadcasterDescription: '버츄얼,라방,트위치,유튜브',
    broadcasterProfileImageUrl:
      'https://static-cdn.jtvnw.net/jtv_user_pictures/d156ff24-5b64-4ffa-83a8-1ecf0d1e71d2-profile_image-150x150.png',
  },
  bestLive: [
    {
      videoUrl: '4Bkuhi7i7Mk',
      liveShoppingId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-70x70.png',
      liveShoppingTitle: '해피쵸이어',
      liveShoppingDescription: '쵸단 x 귀빈정',
      broadcasterProfileImageUrl: '',
    },
    {
      videoUrl: '3TLj00xYR-k',
      liveShoppingId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/45570b84-1206-4c6a-8d6c-d7700204b7b3-profile_image-150x150.png',
      liveShoppingTitle: '메리크크쇼마스',
      liveShoppingDescription: '나는야꼬등어 x 동래아들',
      broadcasterProfileImageUrl: '',
    },
    {
      videoUrl: 'TutKdpA-JRw',
      liveShoppingId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/ec949373-7065-423c-afad-08f9504c8034-profile_image-150x150.png',
      liveShoppingTitle: '신맛의 오늘의 맛',
      liveShoppingDescription: '연나비 X 홍봉자굴림치즈만두',
      broadcasterProfileImageUrl: '',
    },
    {
      videoUrl: 'ISVt_Bu61vU',
      liveShoppingId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/24d7c181-ca61-4297-a276-ccc80a923b47-profile_image-150x150.png',
      liveShoppingTitle: '토여니의 토요일은 즐거워!',
      liveShoppingDescription: '유은 X 먹고집',
      broadcasterProfileImageUrl: '',
    },
    {
      videoUrl: 'tL0_5cmlnbo',
      liveShoppingId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/ec11a121-f980-4256-a94f-775bfd7d4410-profile_image-70x70.png',
      liveShoppingTitle: '나 오늘 취하지 않을거야ㅎ',
      liveShoppingDescription: '듀라나 x 진국보감',
      broadcasterProfileImageUrl: '',
    },
  ],
  bestBroadcaster: [
    {
      nickname: '쵸단',
      broadcasterId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/2067380c-6c8f-4a4d-9f68-65c13572a59b-profile_image-150x150.png',
      promotionPageLinkUrl: 'https://www.xn--hp4b17xa.com/bc/1',
    },
    {
      nickname: '민결희',
      broadcasterId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/d156ff24-5b64-4ffa-83a8-1ecf0d1e71d2-profile_image-150x150.png',
      promotionPageLinkUrl: 'https://www.xn--hp4b17xa.com/bc/1',
    },
    {
      nickname: '나무늘봉순',
      broadcasterId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/5f179460-761b-404e-afc6-9ec9ea26df1a-profile_image-150x150.png',
      promotionPageLinkUrl: 'https://www.xn--hp4b17xa.com/bc/1',
    },
    {
      nickname: '신맛',
      broadcasterId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/f0c609d9-1a37-4896-9024-230488a283fe-profile_image-150x150.png',
      promotionPageLinkUrl: '',
    },
    {
      nickname: '유은',
      broadcasterId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/24d7c181-ca61-4297-a276-ccc80a923b47-profile_image-150x150.png',
      promotionPageLinkUrl: '',
    },
    {
      nickname: '수련수련',
      broadcasterId: null,
      profileImageUrl:
        'https://static-cdn.jtvnw.net/jtv_user_pictures/a27144c9-0c62-46e4-a7a8-9b51b394567a-profile_image-150x150.png',
      promotionPageLinkUrl: '',
    },
  ],
};

export const createKkshowDummyEventPopup = async (
  prisma: PrismaClient,
): Promise<void> => {
  await prisma.kkshowEventPopup.create({
    data: {
      key: 'teQUz7ldUjU_WaqsgsHd6',
      name: '신규가입',
      priority: 1,
      linkUrl: 'https://www.xn--hp4b17xa.com/signup',
      imageUrl: 'event-popup/teQUz7ldUjU_WaqsgsHd6.webp',
      displayPath: ['/', '/bc/', '/shopping'],
      width: 1200,
      height: 1200,
    },
  });
};
