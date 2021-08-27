import { Box, Container, Text } from '@chakra-ui/react';
import { useProfile, useSocialAccounts } from '@project-lc/hooks';
import SettingSectionLayout from './SettingSectionLayout';

import { SocialAccountUnlinkBox } from './SocialAccountUnlinkBox';

export function SocialAccountUnlinkSection(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data } = useSocialAccounts(profileData?.email || ''); // email
  return (
    <SettingSectionLayout title="연결된 소셜 서비스 계정">
      <Text>project-lc에 로그인 하는 데 사용하는 소셜 서비스입니다.</Text>

      {data &&
        data.map((account) => {
          return <SocialAccountUnlinkBox key={account.serviceId} {...account} />;
        })}
    </SettingSectionLayout>
  );
}

export default SocialAccountUnlinkSection;
