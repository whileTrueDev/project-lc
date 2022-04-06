import { useRouter } from 'next/router';
import MypageLayout from '@project-lc/components-shared/MypageLayout';
import UserManual from '@project-lc/components-shared/UserManual';

export function ManualDetailById(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  return (
    <MypageLayout appType="seller">
      <UserManual id={Number(id)} />
    </MypageLayout>
  );
}

export default ManualDetailById;
