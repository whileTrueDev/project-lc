import MypageLayout from '@project-lc/components-shared/MypageLayout';
import UserManual from '@project-lc/components-shared/UserManual';

export function Index(): JSX.Element {
  return (
    <MypageLayout appType="seller">
      <UserManual userType="seller" />
    </MypageLayout>
  );
}

export default Index;
