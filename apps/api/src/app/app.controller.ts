import { Controller, Get } from '@nestjs/common';
import { KkshowMainRes } from '@project-lc/shared-types';

@Controller()
export class AppController {
  @Get()
  healthCheck(): string {
    return 'alive';
  }

  // TODO 테스트용. 삭제 필요 by hwasurr
  @Get('main-data')
  mainData(): KkshowMainRes {
    const data: KkshowMainRes = {
      carousel: [
        {
          type: 'simpleBanner',
          linkUrl: 'https://k-kmarket.com',
          imageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/kkshow-main-carousel-images/1646562210508_goods.jpeg',
          description: '이거 정말 "히트다 히트" 이벤트',
        },
        {
          type: 'upcoming',
          imageUrl:
            'https://k-kmarket.com/data/skin/a_sy01/images/banner/5/images_1.jpg?1645084805',
          videoUrl: 'https://youtu.be/4pIuCJTMXQU',
          normalPrice: 5000,
          liveShoppingId: 1,
          productLinkUrl: 'https://k-kmarket.com/goods/view?no=24525',
          discountedPrice: 3000,
          productImageUrl: 'https://picsum.photos/301/304',
          profileImageUrl: 'https://picsum.photos/301/305',
          liveShoppingName: '더미 라이브 쇼핑 제목',
          broadcasterNickname: 'test',
          promotionPageLinkUrl: '',
        },
        {
          type: 'nowPlaying',
          imageUrl:
            'https://k-kmarket.com/data/skin/a_sy01/images/banner/5/images_1.jpg?1645084805',
          platform: 'youtube',
          videoUrl: 'cseb1WG15ZA',
          normalPrice: 5000,
          liveShoppingId: 1,
          productLinkUrl: 'https://k-kmarket.com/goods/view?no=24525',
          discountedPrice: 3000,
          productImageUrl: 'https://picsum.photos/301/300',
          profileImageUrl: 'https://picsum.photos/301/301',
          liveShoppingName: '더미 라이브 쇼핑 제목',
          broadcasterNickname: 'test',
          promotionPageLinkUrl: '',
        },
        {
          type: 'previous',
          imageUrl:
            'https://k-kmarket.com/data/skin/a_sy01/images/banner/5/images_1.jpg?1645084805',
          videoUrl: '4pIuCJTMXQU',
          normalPrice: 5000,
          liveShoppingId: 1,
          productLinkUrl: 'https://k-kmarket.com/goods/view?no=24525',
          discountedPrice: 3000,
          productImageUrl: 'https://picsum.photos/301/303',
          profileImageUrl: 'https://picsum.photos/301/302',
          liveShoppingName: '더미 라이브 쇼핑 제목',
          broadcasterNickname: 'test',
          promotionPageLinkUrl: '',
        },
      ],
      trailer: {
        imageUrl:
          'https://lc-project.s3.ap-northeast-2.amazonaws.com/live-shopping-images/1/trailer/1646615064823_%E1%84%90%E1%85%A9%E1%84%81%E1%85%B5%E1%84%90%E1%85%A9%E1%84%81%E1%85%B5%E1%84%90%E1%85%A9%E1%84%81%E1%85%B5.jpeg',
        normalPrice: 500,
        liveShoppingId: 1,
        productLinkUrl: 'https://k-kmarket.com/goods/view?no=24525',
        discountedPrice: 50,
        liveShoppingName: '더미 라이브 쇼핑 제목',
        broadcastStartDate: new Date('2022-02-18T08:55:01.272Z'),
        broadcasterNickname: '테스트방송인활동명',
        broadcasterDescription: '버츄얼,라방,트위치,유튜브',
        broadcasterProfileImageUrl:
          'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
      },
      bestLive: [
        {
          videoUrl: 'https://www.youtube.com/embed/3TLj00xYR-k?controls=0',
          liveShoppingId: 1,
          liveShoppingTitle: '해피쵸이어',
          liveShoppingDescription: '쵸단 X 귀빈정',
          broadcasterProfileImageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
        },
        {
          videoUrl: 'https://www.youtube.com/embed/TutKdpA-JRw?controls=0',
          liveShoppingId: 3,
          liveShoppingTitle:
            '신맛의 오늘의 맛신맛의 오늘의 맛신맛의 오늘의 맛신맛의 오늘의 맛신맛의 오늘의 맛',
          liveShoppingDescription: '연나비 X 홍봉자굴림치즈만두홍봉자굴림치즈만두',
          broadcasterProfileImageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
        },
        {
          videoUrl: 'https://www.youtube.com/embed/4Bkuhi7i7Mk?controls=0',
          liveShoppingId: 4,
          liveShoppingTitle: '토여니의 토요일은 즐거워',
          liveShoppingDescription: '유은 X 먹고집',
          broadcasterProfileImageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
        },
        {
          videoUrl: 'https://www.youtube.com/embed/vFv6ZUOEnAo?controls=0',
          liveShoppingId: 1,
          liveShoppingTitle: '메리크크쇼마스',
          liveShoppingDescription: '나는야꼬등어 X 동래아들',
          broadcasterProfileImageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
        },
      ],
      bestBroadcaster: [
        {
          nickname: '방송인3223',
          broadcasterId: 2,
          productPromotionUrl: 'https://k-kmarket.com/',
          profileImageUrl:
            'https://static-cdn.jtvnw.net/jtv_user_pictures/08cd2311635068d3-profile_image-50x50.png',
        },
        {
          nickname: '테스트방송인활동명',
          broadcasterId: 1,
          productPromotionUrl: 'https://k-kmarket.com/',
          profileImageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
        },
        {
          nickname: '테스트방송인활동명',
          broadcasterId: 3,
          productPromotionUrl: 'https://k-kmarket.com/',
          profileImageUrl:
            'https://lc-project.s3.ap-northeast-2.amazonaws.com/avatar/broadcaster/testbc@gmail.com/1646268544276.jpeg',
        },
        {
          nickname: '방송인3223',
          broadcasterId: 4,
          productPromotionUrl: 'https://k-kmarket.com/',
          profileImageUrl:
            'https://static-cdn.jtvnw.net/jtv_user_pictures/08cd2311635068d3-profile_image-50x50.png',
        },
      ],
    };

    return data;
  }
}
