import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useGoodsOutlineByCategoryCode, useOneGoodsCategory } from '@project-lc/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { GoodsDisplay } from '../../GoodsDisplay';

export function CategoryGoodsList(): JSX.Element | null {
  const router = useRouter();
  const categoryCode = router.query.categoryCode as string;
  const { data: category } = useOneGoodsCategory(categoryCode);
  const { data, isLoading } = useGoodsOutlineByCategoryCode(category?.categoryCode);

  const goodsList = useMemo(() => {
    return (
      data
        ?.filter((goods) => goods.options.find((x) => x.default_option === 'y'))
        .map((goods) => {
          const defaultOpt = goods.options.find((x) => x.default_option === 'y');
          const normalPrice = Number.isNaN(Number(defaultOpt?.consumer_price))
            ? 0
            : Number(defaultOpt?.consumer_price);
          const discountedPrice = Number.isNaN(Number(defaultOpt?.price))
            ? 0
            : Number(defaultOpt?.price);
          return {
            id: goods.id,
            name: goods.goods_name,
            imageUrl: goods.image[0]?.image,
            linkUrl: `/goods/${goods.id}`,
            normalPrice,
            discountedPrice,
          };
        }) || []
    );
  }, [data]);

  if (!category) return null;
  return (
    <Box maxW="5xl" margin="auto" w="100%" p={2} minH="60vh">
      <Box my={[0, 4, 10]}>
        <Box mb={4}>
          <CategoryPageBreadCrumb />
        </Box>
        <Text fontWeight="bold" fontSize="2xl" textAlign="center">
          {category.name}
        </Text>
      </Box>

      <SimpleGrid my={2} columns={[3, 3, 5]} gap={2}>
        {category?.parentCategory && (
          <CategoryLinkButton
            categoryCode={category.parentCategory.categoryCode}
            categoryName={category.parentCategory.name}
          />
        )}
        {category?.childrenCategories?.map((child) => (
          <CategoryLinkButton
            key={child.id}
            categoryCode={child.categoryCode}
            categoryName={child.name}
          />
        ))}
      </SimpleGrid>

      <SimpleGrid my={10} gap={6} columns={[1, 2, 4]}>
        {isLoading && <Spinner />}
        {goodsList.map((goodsOutline) => (
          <GridItem
            key={goodsOutline.id}
            display="flex"
            justifyContent="stretch"
            alignItems="stretch"
          >
            <GoodsDisplay goods={goodsOutline} detailProps={{ noOfLines: 2 }} />
          </GridItem>
        ))}
      </SimpleGrid>
    </Box>
  );
}

interface CategoryLinkButtonProps {
  categoryCode: string;
  categoryName: string;
}
export function CategoryLinkButton(props: CategoryLinkButtonProps): JSX.Element {
  const hoveredBgColor = useColorModeValue('gray.50', 'gray.700');
  return (
    <LinkBox>
      <GridItem
        justifyContent="center"
        display="flex"
        alignItems="center"
        py={4}
        px={2}
        w="100%"
        h="100%"
        maxH="70px"
        overflow="hidden"
        textAlign="center"
        wordBreak="keep-all"
        borderWidth="thin"
        rounded="md"
        _hover={{ shadow: 'sm', backgroundColor: hoveredBgColor }}
        _active={{ shadow: 'sm', backgroundColor: hoveredBgColor }}
        fontSize={['sm', 'md']}
      >
        <Link href={`/shopping/category/${props.categoryCode}`} passHref>
          <LinkOverlay href={`/shopping/category/${props.categoryCode}`}>
            <Text>{props.categoryName}</Text>
          </LinkOverlay>
        </Link>
      </GridItem>
    </LinkBox>
  );
}

export function CategoryPageBreadCrumb(): JSX.Element | null {
  const router = useRouter();
  const categoryCode = router.query.categoryCode as string;
  const { data: category } = useOneGoodsCategory(categoryCode);

  const getCategoryHerf = (_categoryCode: string): string => {
    return `/shopping/category/${_categoryCode}`;
  };

  if (!category) return null;
  return (
    <Breadcrumb>
      <BreadcrumbItem>
        <Link href="/shopping" passHref>
          <BreadcrumbLink>홈</BreadcrumbLink>
        </Link>
      </BreadcrumbItem>

      {category.parentCategory?.parentCategory ? (
        <BreadcrumbItem>
          <Link
            href={getCategoryHerf(category.parentCategory.parentCategory.categoryCode)}
            passHref
          >
            <BreadcrumbLink href="#">
              {category.parentCategory.parentCategory.name}
            </BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      ) : null}

      {category.parentCategory ? (
        <BreadcrumbItem>
          <Link href={getCategoryHerf(category.parentCategory.categoryCode)}>
            <BreadcrumbLink href="#">{category.parentCategory.name}</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
      ) : null}

      <BreadcrumbItem isCurrentPage>
        <Link href={getCategoryHerf(category.categoryCode)}>
          <BreadcrumbLink href="#">{category.name}</BreadcrumbLink>
        </Link>
      </BreadcrumbItem>
    </Breadcrumb>
  );
}
