import MypageLayout from '@project-lc/components-shared/MypageLayout';
import UserManualCategoryList from '@project-lc/components-shared/UserManualCategoryList';

export function Index(): JSX.Element {
  return (
    <MypageLayout appType="seller">
      <UserManualCategoryList userType="seller" />
    </MypageLayout>
  );
}

export default Index;
