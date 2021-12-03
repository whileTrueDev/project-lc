import { Text } from '@chakra-ui/react';
import { useProfile, useSocialAccounts } from '@project-lc/hooks';
import { UserType } from '@project-lc/shared-types';
import SettingSectionLayout from './SettingSectionLayout';

import { SocialAccountUnlinkBox } from './SocialAccountUnlinkBox';

export function SocialAccountUnlinkSection({
  userType = 'seller',
}: {
  userType?: UserType;
}): JSX.Element {
  const { data: profileData } = useProfile();
  const { data } = useSocialAccounts(
    userType,
    profileData?.email || userType === 'broadcaster' ? 'a1919361@gmail.com' : '',
  ); // email

  return (
    <SettingSectionLayout title="연결된 소셜 서비스 계정">
      <Text>크크쇼에 로그인 하는 데 사용하는 소셜 서비스입니다.</Text>

      {data &&
        data.map((account) => {
          return (
            <SocialAccountUnlinkBox
              key={account.serviceId}
              {...account}
              userType={userType}
            />
          );
        })}
    </SettingSectionLayout>
  );
}

export default SocialAccountUnlinkSection;
