import { MypageNoticeSection } from '@project-lc/components-shared/MypageNoticeSection';
import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';

const title = '공지사항';

export function NoticeIndex(): JSX.Element {
  return (
    <CustomerMypageLayout title={title}>
      <MypageNoticeSection />
    </CustomerMypageLayout>
  );
}

export default NoticeIndex;
