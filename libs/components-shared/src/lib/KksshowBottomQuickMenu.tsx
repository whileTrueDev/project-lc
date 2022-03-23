import { VStack, Center, Text, useColorModeValue, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { quickMenuLinks } from '@project-lc/components-constants/quickMenu';
import { Icon } from '@chakra-ui/icons';

export function KksshowBottomQuickMenu(): JSX.Element {
  const router = useRouter();
  return (
    <Flex
      display={{ base: 'flex', md: 'none' }}
      justifyContent="space-around"
      position="fixed"
      bottom="0"
      right="0"
      bgColor={useColorModeValue('white', 'gray.700')}
      borderTop="1px solid"
      borderColor={useColorModeValue('gray.300', 'gray.600')}
      width="100%"
      height="7vh"
      zIndex="docked"
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
            <VStack as="button" width="80%" onClick={link.onClick}>
              <Icon as={link.icon} width={5} height={5} />
              <Text>{link.name}</Text>
            </VStack>
          </Center>
        ),
      )}
    </Flex>
  );
}

export default KksshowBottomQuickMenu;
