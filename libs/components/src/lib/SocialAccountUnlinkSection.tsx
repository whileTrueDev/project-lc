import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import { SocialAccount, useProfile, useSocialAccounts } from '@project-lc/hooks';
import SettingSectionLayout from './SettingSectionLayout';

export function SocialAccountUnlinkBox(props: SocialAccount) {
  const { provider, registDate, serviceId } = props;
  return (
    <Flex boxShadow="xs" p="6" rounded="md" width="100%" justify="space-around">
      <Text>{provider}</Text>
      <Text>{registDate}</Text>
      <Text>{serviceId}</Text>
      <Button>연동해제</Button>
    </Flex>
  );
}

export function SocialAccountUnlinkSection(): JSX.Element {
  const { data: profileData } = useProfile();
  const { data } = useSocialAccounts(profileData?.sub);
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
