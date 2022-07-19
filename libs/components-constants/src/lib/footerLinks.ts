export interface FooterLinkListItem {
  title: string;
  items: FooterLink[];
}
export interface FooterLink {
  title: string;
  href: string;
  isBold?: boolean;
}

export const commonFooterLinkList: FooterLinkListItem[] = [
  {
    title: '정책',
    items: [
      {
        title: '개인정보처리방침',
        href: '/privacy',
        isBold: true,
      },
      {
        title: '이용약관',
        href: '/termsOfService',
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
/** 추후 센터별 푸터링크 달라지는 경우 대비하여 다른 변수에 저장 *
 * /
/** 판매자센터 푸터 링크 목록 */
export const sellerFooterLinkList: FooterLinkListItem[] = commonFooterLinkList;

/** 방송인센터 푸터 링크 목록 */
export const broadcasterFooterLinkList: FooterLinkListItem[] = sellerFooterLinkList;

/** 크크쇼(소비자) 푸터 링크 목록 */
export const kkshowFooterLinkList: FooterLinkListItem[] = sellerFooterLinkList;

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
