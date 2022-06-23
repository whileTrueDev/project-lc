import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { Flex } from '@chakra-ui/react';
import { NonMemberOrderFindForm } from '@project-lc/components-web-kkshow/nonmember/NonMemberOrderFindForm';

export function NonMemberIndexPage(): JSX.Element {
  return (
    <KkshowLayout>
      <Flex align="center" justify="center" minH="calc(100vh - 200px)">
        <NonMemberOrderFindForm />
      </Flex>
    </KkshowLayout>
  );
}

export default NonMemberIndexPage;
