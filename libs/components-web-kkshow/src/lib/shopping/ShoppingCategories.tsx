import {
  Flex,
  Image,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useDisplaySize, useKkshowShoppingCategories } from '@project-lc/hooks';
import Link from 'next/link';
import { useMemo } from 'react';

export function ShoppingCategories(): JSX.Element | null {
  const { isMobileSize } = useDisplaySize();
  const { data: categories, isLoading } = useKkshowShoppingCategories();
  const sliceUnit = useMemo(() => (isMobileSize ? 10 : 12), [isMobileSize]);

  const fallbackImageSrc =
    'https://lc-project.s3.ap-northeast-2.amazonaws.com/goods-category/3OODwX2OsE8nUeu79ca59/220728174835';
  const categoryImagePlaceholderColor = useColorModeValue(
    'blackAlpha.100',
    'whiteAlpha.800',
  );
  if (isLoading) return null;
  if (!categories) return null;
  return (
    <Flex
      px={2}
      direction={['column', 'row']}
      mt={[6, 8, 12, 20]}
      maxW="5xl"
      mx="auto"
      align="center"
      justify="center"
      position="relative"
      overflow="hidden"
      gap={12}
      flexWrap="wrap"
    >
      <SimpleGrid columns={{ base: 5, md: 6 }} w="100%" gap={6}>
        {categories
          .filter((x) => !!x.imageSrc)
          .slice(0, sliceUnit)
          .map((category) => (
            <LinkBox key={category.id} role="group">
              <Stack justify="start" align="center">
                <Image
                  // icon={<Icon as={IoFastFoodOutline} fontSize={['1rem', '1.75rem']} />}
                  alt={category.name}
                  fallbackSrc={fallbackImageSrc}
                  backgroundColor={categoryImagePlaceholderColor}
                  draggable={false}
                  rounded="full"
                  objectFit="cover"
                  w={{ base: '40px', sm: '65px', md: '100px' }}
                  h={{ base: '40px', sm: '65px', md: '100px' }}
                  src={category.imageSrc || ''}
                  transition="transform 0.2s"
                  _groupHover={{ shadow: 'lg', transform: 'translateY(2px)' }}
                  _groupActive={{ shadow: 'lg', transform: 'translateY(2px)' }}
                />
                <Link href={`shopping/category/${category.categoryCode}`} passHref>
                  <LinkOverlay href={`shopping/category/${category.categoryCode}`}>
                    <Text fontSize={['xs', 'sm', 'md']} noOfLines={2} textAlign="center">
                      {category.name}
                    </Text>
                  </LinkOverlay>
                </Link>
              </Stack>
            </LinkBox>
          ))}
      </SimpleGrid>
    </Flex>
  );
}

export default ShoppingCategories;
