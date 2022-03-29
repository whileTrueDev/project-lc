import MypageLayout from '@project-lc/components-shared/MypageLayout';
import UserManual from '@project-lc/components-shared/UserManual';

export function Index(): JSX.Element {
  return (
    <MypageLayout appType="broadcaster">
      <UserManual userType="broadcaster" />
    </MypageLayout>
  );
}

export default Index;
