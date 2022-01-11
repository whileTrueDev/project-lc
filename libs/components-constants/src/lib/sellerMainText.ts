const MAIN_IMAGE_PATH = '/images/main';

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
    img: `${MAIN_IMAGE_PATH}/tv_icon/tv_icon.webp`,
    title: '크크쇼',
    desc: '라이브 쇼핑 어렵지 않습니다. 크크쇼와 함께라면!',
  },
  feature: {
    title: `사장님의 마케팅을 확실하고
    새롭게 바꿔드리겠습니다.`,
  },
  process: {
    title: `라이브 쇼핑의 복잡한 절차, 
    크크쇼에서 한 번에 해결하세요.`,
    desc: `라이브 쇼핑의 처음부터 끝까지 
    전문 매니저가 1:1로 전담하여 진행합니다.`,
    img: '', // 절차 이미지
  },
  howToUse: {
    title: '크크쇼 이용 방법',
    desc: `크크쇼에서는 상품 등록, 라이브 쇼핑,
     판매관리, 정산관리까지 모두 할 수 있습니다.`,
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
export const processSectionBody: SectionData[] = [
  { img: `${MAIN_IMAGE_PATH}/step-desktop/step-1.png`, title: '방송인 섭외' },
  { img: `${MAIN_IMAGE_PATH}/step-desktop/step-2.png`, title: '컨텐츠 기획' },
  { img: `${MAIN_IMAGE_PATH}/step-desktop/step-3.png`, title: '홍보물 이미지 제작' },
  { img: `${MAIN_IMAGE_PATH}/step-desktop/step-4.png`, title: 'SNS 홍보' },
  { img: `${MAIN_IMAGE_PATH}/step-desktop/step-5.png`, title: '리허설' },
  { img: `${MAIN_IMAGE_PATH}/step-desktop/step-6.png`, title: '본 방송 리드' },
];

// how to use section 내용
// TODO: img gif로 수정필요
export const howToUseSectionBody: SectionData[] = [
  {
    title: '상품등록',
    desc: `판매자 승인을 받고 상품을 등록합니다.`,
    img: `${MAIN_IMAGE_PATH}/step-desktop/step-1.png`,
  },
  {
    title: '라이브 쇼핑 등록',
    desc: `라이브 방송에 소개할 상품을 선택하고
  요청사항을 입력하면 담당 MD가 직접 방송인
  매칭 및 라이브 커머스 진행을 도와드립니다.   `,
    img: `${MAIN_IMAGE_PATH}/step-desktop/step-2.png`,
  },
  {
    title: '판매 관리',
    desc: `라이브로 판매되는 상품 주문을 실시간으로
  확인하며, 상품 출고를 진행할 수 있습니다. `,
    img: `${MAIN_IMAGE_PATH}/step-desktop/step-3.png`,
  },
  {
    title: '정산 관리',
    desc: `월 2회 구매확정 기준으로 정산 진행하며
  수익현황을 확인할 수 있습니다. `,
    img: `${MAIN_IMAGE_PATH}/step-desktop/step-4.png`,
  },
];
