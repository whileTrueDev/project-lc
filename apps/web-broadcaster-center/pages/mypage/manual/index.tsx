import MypageLayout from '@project-lc/components-shared/MypageLayout';
import UserManualCategoryList from '@project-lc/components-shared/UserManualCategoryList';

export function Index(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster">
      <UserManualCategoryList userType="broadcaster" />
    </MypageLayout>
  );
}

export default Index;
