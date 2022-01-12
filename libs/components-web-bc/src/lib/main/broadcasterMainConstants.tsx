import BroadcasterMainContentsImage from './BroadcasterMainContentsImage';
import BroadcasterMainGiftImage from './BroadcasterMainGiftImage';
import BroadcasterMainIntroduceImage from './BroadcasterMainIntroduceImage';

export interface Thumbnail {
  broadcasterName: string;
  image: string;
  youtubeUrl: string;
}
export const defaultThumbnails: Thumbnail[] = [
  {
    broadcasterName: '나는야꼬등어',
    image: '/images/main/th-1.png',
    youtubeUrl: 'https://youtu.be/3TLj00xYR-k',
  },
  {
    broadcasterName: '유은',
    image: '/images/main/th-2.png',
    youtubeUrl: 'https://youtu.be/ISVt_Bu61vU',
  },
  {
    broadcasterName: '쵸단',
    image: '/images/main/th-5.png',
    youtubeUrl: 'https://youtu.be/4pIuCJTMXQU',
  },
  {
    broadcasterName: '듀라나',
    image: '/images/main/th-3.png',
    youtubeUrl: 'https://youtu.be/tL0_5cmlnbo',
  },
  {
    broadcasterName: '깡마',
    image: '/images/main/th-4.png',
    youtubeUrl: 'https://youtu.be/9QhwkMWQcfY',
  },
];

export interface HowToUseItem {
  title: string;
  contents: string;
  image: string;
}
export const howToUseItems: HowToUseItem[] = [
  {
    title: 'URL 삽입',
    contents: '발급된 URL을 복사하여 송출 프로그램에 붙여넣습니다.',
    image: '/images/main/bc_htu_gif1.gif',
  },
  {
    title: '라이브 진행',
    contents: '라이브 송출 화면을 활용하여 방송을 진행합니다',
    image: '/images/main/bc_htu_gif2.gif',
  },
  {
    title: '수익금 적립',
    contents: '판매수익금, 응원메시지를 확인할 수 있습니다.',
    image: '/images/main/bc_htu_gif3.gif',
  },
  {
    title: '정산 관리',
    contents: '정산 등록 후 쌓인 수익금이 자동으로 정산됩니다.',
    image: '/images/main/bc_htu_gif4.gif',
  },
];

export const processItems = [
  { src: '/images/main/sv_icon1.png', text: '스케쥴 조율' },
  { src: '/images/main/sv_icon2.png', text: '컨텐츠 기획' },
  { src: '/images/main/sv_icon3.png', text: '홍보물 제작' },
  { src: '/images/main/sv_icon4.png', text: 'SNS 홍보' },
  { src: '/images/main/sv_icon5.png', text: '리허설' },
  { src: '/images/main/sv_icon6.png', text: '본 방송 리드' },
];

export interface IntroduceItem {
  title: string;
  subtitle: { pc: string; mobile: string };
  image: JSX.Element;
  grayBackground?: boolean;
  reverse?: boolean;
}
export const introduceItems: IntroduceItem[] = [
  {
    title: '간단한 방송 설정',
    subtitle: {
      pc: '평소 사용하던 송출 프로그램에 크크쇼에서 발급되는 URL을 넣기만 하면\n라이브쇼핑 진행에 필요한 레이아웃이 자동으로 송출됩니다.',
      mobile:
        '평소 사용하던 송출 프로그램에\n크크쇼에서 발급되는 URL을 넣기만 하면\n라이브쇼핑 진행에 필요한 레이아웃이\n자동으로 송출됩니다.',
    },
    image: <BroadcasterMainIntroduceImage />,
    grayBackground: true,
  },
  {
    title: '팬들의 선물',
    subtitle: {
      pc: '시청자가 구매한 상품 금액의 일정 부분이 수익금으로 정산됩니다.\n물론 팬들이 보내는 응원메시지와 선물은 덤이구요.',
      mobile:
        '시청자가 구매한 상품 금액의\n일정 부분이 수익금으로 정산됩니다.\n물론 팬들이 보내는\n응원메시지와 선물은 덤이구요.',
    },
    image: <BroadcasterMainGiftImage />,
    reverse: true,
  },
  {
    title: '새로운 컨텐츠',
    subtitle: {
      pc: '평소 진행하던 방송에서 먹방을 진행할 수 있습니다.\n팬분들과 소통하며 상품도 판매하고 새로운 경험을 해보세요!',
      mobile:
        '평소 진행하던 방송에서\n먹방을 진행할 수 있습니다.\n팬분들과 소통하며 상품도 판매하고\n새로운 경험을 해보세요!',
    },

    image: <BroadcasterMainContentsImage />,
    grayBackground: true,
  },
];
