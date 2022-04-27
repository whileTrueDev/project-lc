import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Skeleton,
  Text,
} from '@chakra-ui/react';
import { GoodsStatus } from '@prisma/client';
import { GoodsStatusBadge } from '@project-lc/components-shared/GoodsStatusBadge';
import { useGoodsById } from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { GoodsViewPurchaseForm } from './GoodsViewPurchaseForm';

export function GoodsViewMeta(): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  if (goods.isLoading) return <GoodsViewMetaLoading />;
  if (!goods.data) return null;
  return (
    <Box
      maxW="5xl"
      m="auto"
      mt={{ base: 0, md: 10 }}
      mb={{ base: 4, md: 20 }}
      p={{ base: 2, md: 0 }}
    >
      <Grid templateColumns="1fr 1fr" gap={{ base: 2, md: 10 }}>
        {/* 좌 */}
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <GoodsViewImages goodsName={goods.data.goods_name} images={goods.data.image} />
        </GridItem>

        {/* 우 */}
        <GridItem colSpan={{ base: 2, md: 1 }} fontWeight="medium" letterSpacing="tight">
          {/* 상품명 및 상품 상태 정보 */}
          <GoodsViewNameAndStatus
            goodsName={goods.data.goods_name}
            summary={goods.data.summary}
            status={goods.data.goods_status}
          />

          {/* 가격정보 */}
          <GoodsViewPriceTag
            goodsOptions={goods.data.options}
            shippingGroup={goods.data.ShippingGroup}
          />

          {/* 옵션 정보 및 후원 정보 */}
          <GoodsViewPurchaseForm goods={goods.data} />
        </GridItem>
      </Grid>
    </Box>
  );
}

/** GoodsViewMeta 로딩화면 */
export function GoodsViewMetaLoading(): JSX.Element {
  return (
    <Box
      maxW="5xl"
      m="auto"
      mt={{ base: 0, md: 10 }}
      mb={{ base: 4, md: 20 }}
      p={{ base: 2, md: 0 }}
    >
      <Grid templateColumns="1fr 1fr" gap={{ base: 2, md: 10 }}>
        {/* 좌 */}
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <Skeleton h={350} w="100%" />
        </GridItem>

        {/* 우 */}
        <GridItem colSpan={{ base: 2, md: 1 }} fontWeight="medium" letterSpacing="tight">
          <Grid templateColumns="1fr 2fr" mt={6} mb={1} gap={2}>
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
            <Skeleton h={30} />
          </Grid>

          <Skeleton my={2} h={30} />
          <Skeleton my={2} h={30} />
          <Skeleton my={2} h={30} />
        </GridItem>
      </Grid>
    </Box>
  );
}

interface GoodsViewImagesProps {
  images: GoodsByIdRes['image'];
  goodsName: GoodsByIdRes['goods_name'];
}
/** 상품 상세 페이지 상품 이미지 목록 */
export function GoodsViewImages({
  images,
  goodsName,
}: GoodsViewImagesProps): JSX.Element {
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  return (
    <Flex gap={2} flexDir={{ base: 'column-reverse', sm: 'row' }}>
      <Box display={{ base: 'flex', sm: 'block' }} gap={2} flexWrap="wrap">
        {images.map((i, idx) => (
          <Image
            cursor="pointer"
            _hover={{ outline: '2px solid', outlineColor: 'blue.400' }}
            outline={selectedImageIdx === idx ? '2px solid' : undefined}
            outlineColor={selectedImageIdx === idx ? 'blue.400' : undefined}
            draggable={false}
            key={i.id}
            src={i.image}
            alt={goodsName + i.id}
            maxW="45px"
            mb={2}
            rounded="md"
            onMouseEnter={() => setSelectedImageIdx(idx)}
          />
        ))}
      </Box>
      <AspectRatio ratio={1 / 1} w="100%" rounded="md">
        <Image
          draggable={false}
          src={images[selectedImageIdx].image}
          alt={goodsName}
          objectFit="cover"
          rounded="md"
        />
      </AspectRatio>
    </Flex>
  );
}

interface GoodsViewNameAndStatusProps {
  goodsName: string;
  summary: string;
  status: GoodsStatus;
}
/** 상품 상세 페이지 상품 이름 및 상태 */
export function GoodsViewNameAndStatus({
  goodsName,
  summary,
  status,
}: GoodsViewNameAndStatusProps): JSX.Element {
  return (
    <Box>
      <Text fontSize={{ base: 'sm', md: 'md' }}>와일트루</Text>
      <Text fontSize={{ base: 'xl', md: '3xl' }} fontWeight="bold">
        {goodsName}
      </Text>
      <Text fontSize={{ base: 'sm', md: 'lg' }} color="GrayText">
        {summary}
      </Text>

      {status !== 'normal' && <GoodsStatusBadge goodsStatus={status} />}
    </Box>
  );
}

interface GoodsViewPriceTagProps {
  goodsOptions: GoodsByIdRes['options'];
  shippingGroup: GoodsByIdRes['ShippingGroup'];
}
/** 상품 상세 페이지 상품 가격정보 */
export function GoodsViewPriceTag({
  goodsOptions,
  shippingGroup,
}: GoodsViewPriceTagProps): JSX.Element {
  // 기본 상품 옵션 데이터
  const defaultOption = useMemo(() => {
    const d = goodsOptions.find((x) => x.default_option === 'y');
    if (!d) return goodsOptions[0];
    return d;
  }, [goodsOptions]);

  return (
    <Grid templateColumns="1fr 2fr" mt={6} mb={1} gap={2}>
      <GridItem>
        <Text>정가</Text>
      </GridItem>
      <GridItem>
        <Text>{getLocaleNumber(defaultOption?.consumer_price)}원</Text>
      </GridItem>

      <GridItem>
        <Text>판매가</Text>
      </GridItem>
      <GridItem>
        <Text>{getLocaleNumber(defaultOption?.price)}원</Text>
      </GridItem>

      <GridItem>
        <Text>배송비</Text>
      </GridItem>
      <GridItem>
        {/* <Text>{getLocaleNumber(goods.data.ShippingGroup.)}원</Text> */}
        <Text>2,500원</Text>
      </GridItem>
    </Grid>
  );
}

export default GoodsViewMeta;
