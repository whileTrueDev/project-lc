import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HeadingProps,
  Image,
  ListItem,
  Skeleton,
  Text,
  UnorderedList,
  useDisclosure,
} from '@chakra-ui/react';
import { Goods, GoodsStatus } from '@prisma/client';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { GoodsStatusBadge } from '@project-lc/components-shared/GoodsStatusBadge';
import ShippingGroupSets from '@project-lc/components-shared/shipping/ShippingGroupSets';
import {
  useGoodsById,
  useLiveShoppingNowOnLive,
  useResizedImage,
} from '@project-lc/hooks';
import { GoodsByIdRes } from '@project-lc/shared-types';
import { useGoodsViewStore } from '@project-lc/stores';
import {
  getDiscountedRate,
  getLocaleNumber,
  getStandardShippingCost,
  pushDataLayer,
} from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { useMemo, useState, useEffect, useRef } from 'react';
import GoodsViewInformationNotice from './GoodsViewInformationNotice';
import { GoodsViewPurchaseBox, GoodsViewPurchaseBoxProps } from './GoodsViewPurchaseBox';

type GoodsViewMetaProps = Pick<GoodsViewPurchaseBoxProps, 'pageTransferType'>;
export function GoodsViewMeta({
  pageTransferType,
}: GoodsViewMetaProps): JSX.Element | null {
  const router = useRouter();
  const goodsId = router.query.goodsId as string;
  const goods = useGoodsById(goodsId);

  const dataLayerPushed = useRef<boolean>(false); // 이벤트가 두번 발생해서 플래그변수 저장
  // ga4 전자상거래 view_item 이벤트 https://developers.google.com/analytics/devguides/collection/ga4/ecommerce?client_type=gtm#view_item
  // TODO: 전자상거래 datalayer push 하는 함수들 모아두기..??
  useEffect(() => {
    if (goods.data && !dataLayerPushed.current) {
      const price = Number(goods.data.options?.[0]?.price || 0); // 할인가
      const ogirinalPrice = goods.data.options?.[0]?.consumer_price || 0; // 정가(미할인가)
      const discount = Number(ogirinalPrice) - price; // 할인된 금액
      const shopName = goods.data.seller.sellerShop?.shopName; // 공급회사
      const category = goods.data.categories?.[0].name || '';
      pushDataLayer({
        event: 'view_item',
        ecommerce: {
          items: [
            {
              item_id: goods.data.id,
              item_name: goods.data.goods_name,
              affiliation: shopName,
              discount,
              price,
              item_category: category,
            },
          ],
          currency: 'KRW',
          value: goods.data.options?.[0]?.price || 0,
        },
      });
      dataLayerPushed.current = true;
    }
  }, [goods]);

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
      <Grid templateColumns="1fr 1fr" gap={{ base: 2, md: 10 }} px={2}>
        {/* 좌 */}
        <GridItem colSpan={{ base: 2, md: 1 }}>
          <GoodsViewImages goodsName={goods.data.goods_name} images={goods.data.image} />
        </GridItem>

        {/* 우 */}
        <GridItem colSpan={{ base: 2, md: 1 }} letterSpacing="tight">
          {/* 상품명 및 상품 상태 정보 */}
          <GoodsViewNameAndStatus
            goodsName={goods.data.goods_name}
            summary={goods.data.summary}
            status={goods.data.goods_status}
            shopName={goods.data.seller.sellerShop?.shopName}
          />

          {/* 가격정보 */}
          <GoodsViewPriceTag
            goodsId={goods.data.id}
            goodsOptions={goods.data.options}
            shippingGroup={goods.data.ShippingGroup}
          />

          {/* 상품 필수 정보 */}
          <GoodsViewInformationNotice />

          {/* 옵션 정보 및 후원 정보 */}
          <Box display={{ base: 'none', md: 'block' }}>
            <GoodsViewPurchaseBox
              goods={goods.data}
              pageTransferType={pageTransferType}
            />
          </Box>

          {/* 상품 기타 정보 info */}
          <Box>
            <GoodsViewOtherInformation goodsOtherInformation={goods.data} />
          </Box>
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
        <GridItem colSpan={{ base: 2, md: 1 }} letterSpacing="tight">
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
export default GoodsViewMeta;

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
    <Flex gap={2} flexDir={{ base: 'column-reverse', md: 'row' }}>
      <Box display={{ base: 'flex', md: 'block' }} gap={2} flexWrap="wrap">
        {images.map((i, idx) => (
          <GoodsViewImagesItem
            key={i.id}
            isSeleceted={selectedImageIdx === idx}
            src={i.image}
            alt={goodsName + i.id}
            onMouseEnter={() => setSelectedImageIdx(idx)}
          />
        ))}
      </Box>
      <AspectRatio ratio={1 / 1} w="100%" rounded="md">
        <ChakraNextImage
          layout="fill"
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
interface GoodsViewImagesItemProps {
  src: string;
  alt: string;
  isSeleceted?: boolean;
  onMouseEnter: () => void;
}
function GoodsViewImagesItem({
  src,
  alt,
  isSeleceted,
  onMouseEnter,
}: GoodsViewImagesItemProps): JSX.Element {
  const resizedImageProps = useResizedImage(src);
  return (
    <Image
      cursor="pointer"
      _hover={{ outline: '2px solid', outlineColor: 'blue.400' }}
      outline={isSeleceted ? '2px solid' : undefined}
      outlineColor={isSeleceted ? 'blue.400' : undefined}
      draggable={false}
      alt={alt}
      width="45px"
      mb={2}
      rounded="md"
      onMouseEnter={onMouseEnter}
      {...resizedImageProps}
    />
  );
}

interface GoodsViewNameAndStatusProps {
  shopName?: string | null;
  goodsName: string;
  summary: string;
  status: GoodsStatus;
}
/** 상품 상세 페이지 상품 이름 및 상태 */
export function GoodsViewNameAndStatus({
  shopName,
  goodsName,
  summary,
  status,
}: GoodsViewNameAndStatusProps): JSX.Element {
  return (
    <Box>
      {shopName && <Text fontSize={{ base: 'sm', md: 'md' }}>{shopName}</Text>}
      <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="bold">
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
  goodsId: GoodsByIdRes['id'];
}
/** 상품 상세 페이지 상품 가격정보 */
export function GoodsViewPriceTag({
  goodsOptions,
  shippingGroup,
  goodsId,
}: GoodsViewPriceTagProps): JSX.Element {
  // 기본 상품 옵션 데이터
  const defaultOption = useMemo(() => {
    const d = goodsOptions.find((x) => x.default_option === 'y');
    if (!d) return goodsOptions[0];
    return d;
  }, [goodsOptions]);

  const standardShippingCost = useMemo(
    () => getStandardShippingCost(shippingGroup),
    [shippingGroup],
  );

  const deliveryFeeToggle = useDisclosure();

  const discountRate = useMemo(() => {
    return getDiscountedRate(
      Number(defaultOption.consumer_price),
      Number(defaultOption.price),
    );
  }, [defaultOption.consumer_price, defaultOption.price]);

  // 후원방송인 존재 && 특가정보 존재하는 경우 => Live 특가를 표시한다
  const selectedBc = useGoodsViewStore((s) => s.selectedBc);
  // 현재상품 & 선택된 방송인이 현재 진행중인 라이브쇼핑(목록형태로 리턴됨. 동일 방송인이 동시에 같은 상품을 라이브방송하지는 않으므로 첫번째 값을 사용함)
  const nowOnliveLsListBySelectedBc = useLiveShoppingNowOnLive({
    goodsId,
    broadcasterId: selectedBc?.id,
  });
  // 라이브 특가가 존재하는지, 특가옵션 중 최저가, 라이브특가 할인율
  const { hasLiveShoppingSpecialPrice, cheapestPrice, specialPriceDiscountRate } =
    useMemo(() => {
      const specialPriceInfo: {
        hasLiveShoppingSpecialPrice: boolean;
        cheapestPrice: number | null;
        specialPriceDiscountRate: string;
      } = {
        hasLiveShoppingSpecialPrice: false,
        cheapestPrice: Number(defaultOption?.price),
        specialPriceDiscountRate: '',
      };

      if (
        selectedBc &&
        nowOnliveLsListBySelectedBc.data &&
        nowOnliveLsListBySelectedBc.data[0] &&
        nowOnliveLsListBySelectedBc.data[0].liveShoppingSpecialPrices.length > 0
      ) {
        const specialPriceArr =
          nowOnliveLsListBySelectedBc.data[0].liveShoppingSpecialPrices.map((spData) =>
            Number(spData.specialPrice),
          );
        specialPriceInfo.cheapestPrice = Math.min(
          ...specialPriceArr.concat(Number(defaultOption.price)),
        );
        specialPriceInfo.specialPriceDiscountRate = getDiscountedRate(
          Number(defaultOption.consumer_price),
          Number(specialPriceInfo.cheapestPrice),
        );

        // 라이브특가 정보가 존재하고, 최저가가 기존옵션가보다 작은경우 특가가 존재한다고 판단함
        specialPriceInfo.hasLiveShoppingSpecialPrice =
          !!specialPriceInfo.cheapestPrice &&
          specialPriceInfo.cheapestPrice < Number(defaultOption.price);
      }

      return specialPriceInfo;
    }, [
      defaultOption.price,
      defaultOption.consumer_price,
      selectedBc,
      nowOnliveLsListBySelectedBc.data,
    ]);

  return (
    <Grid
      templateColumns="1fr 2fr"
      mt={6}
      mb={1}
      gap={2}
      fontSize={{ base: 'sm', md: 'md' }}
    >
      <GridItem>
        <Text>정가</Text>
      </GridItem>
      <GridItem>
        <Text
          fontWeight="medium"
          textDecoration={hasLiveShoppingSpecialPrice ? 'line-through' : undefined}
          color={hasLiveShoppingSpecialPrice ? 'GrayText' : undefined}
        >
          {getLocaleNumber(defaultOption?.consumer_price)}원
        </Text>
      </GridItem>

      <GridItem>
        <Text>판매가</Text>
      </GridItem>
      <GridItem
        textDecoration={hasLiveShoppingSpecialPrice ? 'line-through' : undefined}
        color={hasLiveShoppingSpecialPrice ? 'GrayText' : undefined}
      >
        <Flex gap={1} flexWrap="wrap" alignItems="center">
          <Text id="price" fontWeight="medium">
            {getLocaleNumber(defaultOption?.price)}원
          </Text>
          {defaultOption && discountRate !== '0' && !hasLiveShoppingSpecialPrice && (
            <DiscountRateText discountRate={discountRate} id="discount-rate" />
          )}
        </Flex>
      </GridItem>

      {/* 라이브 특가가 존재하는 경우 표시 */}
      {hasLiveShoppingSpecialPrice && (
        <>
          <GridItem>
            <Flex alignItems="center" height="100%">
              <Text fontWeight="extrabold">LIVE특가</Text>
            </Flex>
          </GridItem>
          <GridItem>
            <Flex gap={1} flexWrap="wrap" alignItems="center">
              <Text id="special-cheapest-price" fontWeight="extrabold" fontSize="2xl">
                {getLocaleNumber(cheapestPrice)}원
              </Text>
              <DiscountRateText discountRate={specialPriceDiscountRate} />
            </Flex>
          </GridItem>
        </>
      )}

      {shippingGroup && (
        <>
          <GridItem>
            <Text>배송비</Text>
          </GridItem>
          <GridItem>
            <Flex flexWrap="wrap" gap={1} alignItems="center">
              {`${getLocaleNumber(standardShippingCost)}원`}
              <Button size="xs" onClick={deliveryFeeToggle.onToggle}>
                자세히보기
              </Button>
            </Flex>
          </GridItem>
          {deliveryFeeToggle.isOpen && (
            <GridItem colSpan={2}>
              <ShippingGroupSets shippingSets={shippingGroup.shippingSets} />
            </GridItem>
          )}
        </>
      )}
    </Grid>
  );
}

function DiscountRateText({
  discountRate,
  ...rest
}: { discountRate: string } & HeadingProps): JSX.Element {
  return (
    <Heading ml={2} as="span" fontSize="lg" color="blue.500" {...rest}>
      {discountRate}%
    </Heading>
  );
}

interface GoodsViewOtherInformationProps {
  goodsOtherInformation: {
    max_purchase_limit: Goods['max_purchase_limit'];
    max_purchase_ea: Goods['max_purchase_ea'];
    max_urchase_order_limit: Goods['max_urchase_order_limit'];
    min_purchase_ea: Goods['min_purchase_ea'];
    min_purchase_limit: Goods['min_purchase_limit'];
  };
}
function GoodsViewOtherInformation({
  goodsOtherInformation: goi,
}: GoodsViewOtherInformationProps): JSX.Element | null {
  if (goi.max_purchase_limit === 'unlimit' && goi.min_purchase_limit === 'unlimit') {
    return null;
  }
  return (
    <UnorderedList fontSize="xs" mt={2}>
      {goi.min_purchase_limit === 'limit' && (
        <ListItem>
          <Text>최소 구매 수량: {goi.min_purchase_ea} 개</Text>
        </ListItem>
      )}
      {goi.max_purchase_limit === 'limit' && (
        <ListItem>
          <Text>최대 구매 가능 수량: {goi.max_purchase_ea} 개</Text>
        </ListItem>
      )}
    </UnorderedList>
  );
}
