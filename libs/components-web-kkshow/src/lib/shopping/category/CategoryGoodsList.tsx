/* eslint-disable react/no-array-index-key */
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Center,
  GridItem,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { useGoodsOutlineByCategoryCode, useOneGoodsCategory } from '@project-lc/hooks';
import { GoodsOutlineByIdRes } from '@project-lc/shared-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Fragment, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GoodsDisplay } from '../../GoodsDisplay';

export function CategoryGoodsList(): JSX.Element | null {
  const router = useRouter();
  const categoryCode = router.query.categoryCode as string;
  const { data: category } = useOneGoodsCategory(categoryCode);
  const { data, isLoading, isFetching, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useGoodsOutlineByCategoryCode(category?.categoryCode, { take: 3 });

  // ref 전달한 더보기버튼이 화면에 들어왔는지 확인하여 다음목록 요청
  const { ref, inView } = useInView({ threshold: 1 });
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  // goods outline 데이터를 GoodsDisplay 데이터로 변환하는 작업
  const makeGoodsOutlineToGoodsDisplay = useCallback(
    (goodsOutline: GoodsOutlineByIdRes) => {
      const defaultOpt = goodsOutline.options.find((x) => x.default_option === 'y');
      const normalPrice = Number.isNaN(Number(defaultOpt?.consumer_price))
        ? 0
        : Number(defaultOpt?.consumer_price);
      const discountedPrice = Number.isNaN(Number(defaultOpt?.price))
        ? 0
        : Number(defaultOpt?.price);
      return {
        id: goodsOutline.id,
        name: goodsOutline.goods_name,
        imageUrl: goodsOutline.image[0]?.image,
        linkUrl: `/goods/${goodsOutline.id}`,
        normalPrice,
        discountedPrice,
      };
    },
    [],
  );

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

      <SimpleGrid columns={[3, 3, 5]} gap={2}>
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
        {data?.pages?.map((goodsList, idx) => (
          <Fragment key={`GoodsOutlineByCategory${idx}`}>
            {goodsList?.edges?.map((goodsOutline) => (
              <GridItem
                key={goodsOutline.id}
                display="flex"
                justifyContent="stretch"
                alignItems="stretch"
              >
                <GoodsDisplay
                  goods={makeGoodsOutlineToGoodsDisplay(goodsOutline)}
                  detailProps={{ noOfLines: 2 }}
                />
              </GridItem>
            ))}
          </Fragment>
        ))}
      </SimpleGrid>

      <Center my={10}>
        {hasNextPage && (
          <Button
            ref={ref}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            더보기
          </Button>
        )}
        {(isLoading || isFetching) && <Spinner />}
      </Center>
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
        py={[1, 2, 4]}
        px={2}
        w="100%"
        h="100%"
        maxH={['50px', '50px', '70px']}
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
