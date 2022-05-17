import { ChevronRightIcon } from '@chakra-ui/icons';
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react';
import { useGoodsById } from '@project-lc/hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';

export function GoodsViewBreadCrumb(): JSX.Element {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  return (
    <Box maxW="5xl" m="auto" mt={4} mb={2} px={2} display={{ base: 'none', sm: 'block' }}>
      <Breadcrumb separator={<ChevronRightIcon color="gray.500" />}>
        <BreadcrumbItem>
          <Link href="/shopping" passHref>
            <BreadcrumbLink href="/shopping">쇼핑</BreadcrumbLink>
          </Link>
        </BreadcrumbItem>
        {/* // TODO: 카테고리 추가 및 카테고리 페이지 추가 이후 카테고리 링크  */}
        {/* <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{goods.data?.category.categoryName}</BreadcrumbLink>
        </BreadcrumbItem> */}
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{goods.data?.goods_name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    </Box>
  );
}
