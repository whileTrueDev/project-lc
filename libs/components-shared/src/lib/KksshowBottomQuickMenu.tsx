import { VStack, Center, SimpleGrid, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { quickMenuLinks } from '@project-lc/components-constants/quickMenu';
import { Icon } from '@chakra-ui/icons';

export function KksshowBottomQuickMenu(): JSX.Element {
  const router = useRouter();
  return (
    <SimpleGrid
      columns={3}
      position="fixed"
      bottom="0"
      right="0"
      bgColor="gray.100"
      borderTop="1px solid #d2d2d2"
      width="100%"
      height="10vh"
      zIndex="9999"
    >
      {quickMenuLinks.map((link) =>
        link.type === 'link' ? (
          <Center w="100%">
            <VStack as="button" width="80%" onClick={() => router.push(link.href || '')}>
              <Icon as={link.icon} width={5} height={5} />
              <Text>{link.name}</Text>
            </VStack>
          </Center>
        ) : (
          <Center w="100%">
            <VStack as="button" width="80%" onClick={link.onClickFunction}>
              <Icon as={link.icon} width={5} height={5} />
              <Text>{link.name}</Text>
            </VStack>
          </Center>
        ),
      )}
    </SimpleGrid>
  );
}

export default KksshowBottomQuickMenu;
