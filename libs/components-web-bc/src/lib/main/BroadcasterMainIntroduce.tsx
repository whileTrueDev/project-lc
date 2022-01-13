import {
  Box,
  Flex,
  Heading,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { MainSectionLayout } from '@project-lc/components-layout/MainSectionLayout';
import { IntroduceItem, introduceItems } from './broadcasterMainConstants';

export function BroadcasterMainIntroduce(): JSX.Element {
  return (
    <MainSectionLayout _title={'평소 방송하던 곳에서\n라이브 쇼핑을 진행해 보세요.'}>
      {introduceItems.map((item) => (
        <BroadcasterMainIntroduceLayout
          key={item.title}
          title={item.title}
          subtitle={item.subtitle}
          image={item.image}
          grayBackground={item.grayBackground}
          reverse={item.reverse}
        />
      ))}
    </MainSectionLayout>
  );
}
export default BroadcasterMainIntroduce;

type BroadcasterMainIntroduceLayoutProps = IntroduceItem;
function BroadcasterMainIntroduceLayout({
  title,
  subtitle,
  image,
  grayBackground = false,
  reverse = false,
}: BroadcasterMainIntroduceLayoutProps): JSX.Element {
  const realSubtitle = useBreakpointValue([subtitle.mobile, subtitle.pc]);
  const grayBgColor = useColorModeValue('gray.100', 'gray.900');
  return (
    <Box
      bgColor={grayBackground ? grayBgColor : 'unset'}
      textAlign={reverse ? 'right' : 'unset'}
      overflow={{ base: 'hidden visible', xl: 'hidden hidden' }}
    >
      <Flex
        maxW="6xl"
        minH={500}
        p={4}
        gap={4}
        mx="auto"
        alignItems="center"
        flexDir={{ base: 'column', xl: reverse ? 'row-reverse' : 'row' }}
        textAlign={{ base: 'center', xl: 'inherit' }}
        justify={{ base: 'center', xl: 'space-between' }}
      >
        <Box flex={1} mt={{ base: 24, xl: 0 }}>
          <Heading color="blue.400" fontSize={{ base: 'xl', sm: '4xl' }} fontWeight={600}>
            {title}
          </Heading>
          <Box fontWeight="medium" mt={2}>
            <Text whiteSpace="break-spaces">{realSubtitle}</Text>
          </Box>
        </Box>
        <Box flex={1} mb={{ base: 12, xl: 0 }}>
          {image}
        </Box>
      </Flex>
    </Box>
  );
}
