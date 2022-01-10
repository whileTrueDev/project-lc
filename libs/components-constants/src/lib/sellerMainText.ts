export type SectionData = Partial<{
  title: string;
  desc: string;
  img: string;
}>;

// 메인페이지 섹션별 제목, 이미지
export const sellerMainSectionText: Record<string, SectionData> = {
  heroText: {
    title: '판매자 센터',
    desc: '판매의 처음부터 끝까지 편리하게 관리할 수 있습니다.',
  },
  heroImage: {
    img: '/images/main/tv_icon/tv_icon.webp',
    title: '크크쇼',
    desc: '라이브 쇼핑 어렵지 않습니다. 크크쇼와 함께라면!',
  },
  feature: {
    title: `사장님의 마케팅을 확실하고
    새롭게 바꿔드리겠습니다.`,
  },
  process: {
    title: '라이브 쇼핑의 복잡한 절차, 크크쇼에서 한 번에 해결하세요.',
    desc: '라이브 쇼핑의 처음부터 끝까지 전문 매니저가 1:1로 전담하여 진행합니다.',
    img: '', // 절차 이미지
  },
  howToUser: {
    title: '크크쇼 이용 방법',
    desc: '크크쇼에서는 상품 등록, 라이브 쇼핑, 판매관리, 정산관리까지 모두 할 수 있습니다.',
    img: '', // gif 이미지 제공예정
  },
  review: {
    title: '사장님들의 생생한 후기로 증명된 크크쇼 효과 ',
    desc: `크크쇼를 진행했던 대표님들의 라이브 쇼핑 서비스에 대한 후기입니다.
    (실제 대화 내용 캡처)`,
  },
};

// feature section 내용
export const featureSectionBody: SectionData[] = [
  {
    title: '1. 라이브 쇼핑',
    desc: `크크쇼는 크리에이터와 팬이 만들어 가는 라이브 쇼핑 컨텐츠로, 상품 홍보와 판매를 동시에
    할 수 있습니다. 1인 방송 전문 방송인의 친절한 설명과 생생한 리뷰로 매출을 늘려 보세요!`,
  },
  {
    title: '2. MZ세대 타겟팅',
    desc: `크크쇼와 연동되어 운영하는 크크마켓은 간편식 전문몰로, 간편식을 필요로 하는
    혼밥러/자취러와 같은 젊은 세대의 꾸준한 유입을 자부합니다!`,
  },
  {
    title: '3. 유튜브 업로드, SNS 홍보',
    desc: `라이브를 진행한 영상 편집본, 홍보물 등은 크크쇼 자체 마케팅 채널(유튜브, 인스타그램, 블로그
      등)에 업로드 되어 SNS 상에 상품 검색 노출에 유리한 컨텐츠를 제작 및 업로드 해드립니다. `,
  },
];

// process section 내용
export const processSectionBody: SectionData[] = [{}];
