export interface FooterLinkListItem {
  title: string;
  items: FooterLink[];
}
export interface FooterLink {
  title: string;
  href: string;
  isBold?: boolean;
}
/** 판매자센터 푸터 링크 목록 */
export const sellerFooterLinkList: FooterLinkListItem[] = [
  {
    title: '정책',
    items: [
      {
        title: '개인정보처리방침',
        href: 'https://whiletrue.notion.site/7f6758f5344246c4989ac22f3ee7532e',
        isBold: true,
      },
      {
        title: '이용약관',
        href: 'https://whiletrue.notion.site/41561f284f754560a64f36bc7c292861',
      },
    ],
  },
  {
    title: '고객지원',
    items: [
      {
        title: 'FAQ',
        href: 'https://whiletrue.notion.site/FAQ-f182f90b7e984badb031a62ddd1bd00d',
      },
    ],
  },
];

/** 방송인센터 푸터 링크 목록 */
export const broadcasterFooterLinkList: FooterLinkListItem[] = [
  {
    title: '정책',
    items: [
      {
        title: '개인정보처리방침',
        href: 'https://whiletrue.notion.site/7f6758f5344246c4989ac22f3ee7532e',
        isBold: true,
      },
      {
        title: '이용약관',
        href: 'https://whiletrue.notion.site/72546ba3dcec48eda9340e2b1d292d35',
      },
    ],
  },
  {
    title: '고객지원',
    items: [
      {
        title: 'FAQ',
        href: 'https://whiletrue.notion.site/FAQ-f182f90b7e984badb031a62ddd1bd00d',
      },
    ],
  },
];

/** 방송인센터 푸터 링크 목록 */
export const kkshowFooterLinkList: FooterLinkListItem[] = [
  {
    title: '정책',
    items: [
      {
        title: '개인정보처리방침',
        href: 'https://whiletrue.notion.site/7f6758f5344246c4989ac22f3ee7532e',
        isBold: true,
      },
      {
        title: '이용약관',
        href: 'https://whiletrue.notion.site/72546ba3dcec48eda9340e2b1d292d35',
      },
    ],
  },
  {
    title: '고객지원',
    items: [
      {
        title: 'FAQ',
        href: 'https://whiletrue.notion.site/FAQ-f182f90b7e984badb031a62ddd1bd00d',
      },
    ],
  },
];

export const footerInfoArr = [
  '상호명 : 와일트루',
  '사업장소재지 : 부산광역시 금정구 장전온천천로 51 (테라스파크) 313호',
  '사업자등록번호 : 659-03-01549',
  '통신판매업신고 : 2019-부산금정-0581',
  '대표이사 : 강동기',
  '개인정보담당자 : 전민관',
  '고객센터 : 051-515-6309',
  '메일 : support@onad.io',
];
