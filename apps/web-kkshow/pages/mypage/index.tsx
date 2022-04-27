import CustomerMypageLayout from '@project-lc/components-web-kkshow/mypage/CustomerMypageLayout';
import { CustomerMypageMobileSidebar } from '@project-lc/components-web-kkshow/mypage/CustomerMypageSidebar';
import { CustomerStatusSection } from '@project-lc/components-web-kkshow/mypage/CustomerStatusSection';

export function Index(): JSX.Element {
  return (
    <CustomerMypageLayout>
      <CustomerStatusSection />
      <CustomerMypageMobileSidebar />
    </CustomerMypageLayout>
  );
}

export default Index;
