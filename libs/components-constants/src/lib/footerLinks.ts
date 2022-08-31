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
      {
        title: '공지사항',
        href: 'https://whiletrue.notion.site/624da834257946dd91c0c4bcb7d8ab67',
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
  { contents: '상호명 : 와일트루' },
  {
    contents:
      '사업장소재지 : 부산광역시 연제구 연제로 24, 2층 207호(연산동, 부산청년창업허브)',
    relatedLink: {
      name: '사업자정보확인',
      href: 'http://www.ftc.go.kr/bizCommPop.do?wrkr_no=6590301549',
    },
  },
  { contents: '사업자등록번호 : 659-03-01549' },
  { contents: '통신판매업신고 : 2022-부산연제-0281' },
  { contents: '대표이사 : 강동기' },
  { contents: '개인정보담당자 : 전민관' },
  { contents: '유선 전화번호 : 051-939-6309' },
  { contents: '메일 : support@onad.io' },
];
