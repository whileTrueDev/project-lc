import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  Grid,
  Heading,
  Image,
} from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import FadeUp from '@project-lc/components-layout/motion/FadeUp';
import { useKkshowShopping } from '@project-lc/hooks';
import { KkshowShoppingTabThemeData } from '@project-lc/shared-types';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import KkshowMainTitle from '../main/KkshowMainTitle';

export function ShoppingKeywords(): JSX.Element {
  const router = useRouter();
  const { data } = useKkshowShopping();
  const [selectedTheme, setSelectedTheme] = useState<KkshowShoppingTabThemeData | null>(
    null,
  );
  const handleThemeSelect = (kkshowTheme: KkshowShoppingTabThemeData): void => {
    setSelectedTheme(kkshowTheme);
  };

  useEffect(() => {
    if (data) {
      handleThemeSelect(data.keywords[0]);
    }
  }, [data]);

  const handleKeywordSelect = (clickedKeyword: string): void => {
    router.push({ pathname: 'search', query: { keyword: clickedKeyword } });
  };

  return (
    <Box maxW="5xl" mx="auto" my={[10, 20]} minH={[600, 600, 700]} px={2}>
      <KkshowMainTitle bulletVariant="none" color="blue.500" bulletPosition="left">
        <Heading as="p" fontSize={{ base: '2xl', md: '3xl' }} color="blue.500">
          뭘 먹을지 모르겠다면?
        </Heading>
      </KkshowMainTitle>

      <FadeUp boxProps={{ as: Center }}>
        <ButtonGroup variant="ghost">
          {data &&
            data.keywords.map((goodsTheme) => (
              <Button
                key={goodsTheme.theme}
                onClick={() => handleThemeSelect(goodsTheme)}
              >
                <Heading fontSize="xl">{goodsTheme.theme}</Heading>
              </Button>
            ))}
        </ButtonGroup>
      </FadeUp>

      <Grid
        gridTemplateColumns={{ base: '1fr 1fr', sm: '1fr 1fr 1fr', md: 'repeat(6, 1fr)' }}
        gap={[2, 4]}
        mt={4}
      >
        {selectedTheme &&
          selectedTheme.keywords.slice(0, 6).map((keyword) => (
            <FadeUp key={keyword.keyword} isChild direction="up-to-down">
              <Button isFullWidth onClick={() => handleKeywordSelect(keyword.keyword)}>
                {keyword.keyword}
              </Button>
            </FadeUp>
          ))}
      </Grid>

      <FadeUp>
        <Flex mt={20} justify="center" position="relative">
          <MotionBox
            position="absolute"
            left={['10%', '15%', '20%']}
            animate={{
              y: [0, -15, 0],
              transition: { repeat: Infinity, duration: 3.5 },
            }}
          >
            <Image
              draggable={false}
              src="images/shopping/bg-circle.png"
              h={[200, 200, 300]}
            />
          </MotionBox>
          {selectedTheme && selectedTheme.imageUrl ? (
            <Image
              draggable={false}
              pos="absolute"
              src={selectedTheme.imageUrl}
              h={[260, 300, 400]}
            />
          ) : (
            <Image
              draggable={false}
              pos="absolute"
              src="images/shopping/keyword.png"
              h={[260, 300, 400]}
            />
          )}
        </Flex>
      </FadeUp>
    </Box>
  );
}

export default ShoppingKeywords;
