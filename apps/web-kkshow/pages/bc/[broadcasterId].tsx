/* eslint-disable react/no-array-index-key */
import NextLink from 'next/link';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Link,
  LinkBox,
  LinkOverlay,
  SimpleGrid,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import MotionBox from '@project-lc/components-core/MotionBox';
import RedLinedText from '@project-lc/components-core/RedLinedText';
import { GoodsDisplayImage } from '@project-lc/components-web-kkshow/GoodsDisplay';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import {
  useBroadcaster,
  useBroadcasterChannels,
  useLiveShoppingNowPlaying,
  usePromotionPage,
  usePromotionPageGoods,
} from '@project-lc/hooks';
import { PromotionPagePromotionGoods } from '@project-lc/shared-types';
import { getDiscountedRate, getLocaleNumber } from '@project-lc/utils-frontend';
import { useRouter } from 'next/router';
import { Fragment, useEffect, useMemo } from 'react';
import { FaInstagram, FaTwitch, FaYoutube } from 'react-icons/fa';
import { useInView } from 'react-intersection-observer';

export function BroadcasterPromotionPage(): JSX.Element {
  const router = useRouter();
  const broadcasterId = router.query.broadcasterId as string;

  const tabInfo = useMemo(
    () => [
      {
        title: '상품',
        component: <PromotionPageGoodsList broadcasterId={broadcasterId} />,
      },
      { isDisabled: true, title: '라이브방송(준비중)', component: <p>방송목록</p> },
    ],
    [broadcasterId],
  );

  return (
    <Box>
      <KkshowLayout>
        <Box m="auto" maxW="5xl" p={2} minH="80vh" mt={[5, 10, 20]}>
          <PromotionPageProfile broadcasterId={broadcasterId} />

          <Tabs variant="line" align="center" mt={30}>
            <TabList>
              {tabInfo.map((tab) => (
                <Tab isDisabled={tab.isDisabled} key={tab.title}>
                  {tab.title}
                </Tab>
              ))}
            </TabList>

            <TabPanels textAlign="left">
              {tabInfo.map((tab) => (
                <TabPanel key={tab.title} px={0}>
                  {tab.component}
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
        </Box>
      </KkshowLayout>
    </Box>
  );
}

interface PromotionPageProfileProps {
  broadcasterId: number | string;
}
function PromotionPageProfile({ broadcasterId }: PromotionPageProfileProps): JSX.Element {
  const bc = useBroadcaster({ id: broadcasterId });
  const channels = useBroadcasterChannels(Number(broadcasterId));
  const { data: promotinoPage } = usePromotionPage(broadcasterId);
  return (
    <Flex
      justifyContent="center"
      display="flex"
      alignItems="center"
      flexDir="column"
      gap={2}
    >
      <Avatar h={{ base: 20, md: 40 }} w={{ base: 20, md: 40 }} src={bc.data?.avatar} />
      <Text fontSize="2xl">{bc.data?.userNickname}</Text>
      <Flex my={4} gap={4} maxW={400}>
        {channels.data?.map((channel) => (
          <Box key={channel.id}>
            {channel.url.includes('twitch.com') && <FaTwitch color="purple" />}
            {channel.url.includes('youtube.com') && <FaYoutube color="red" />}
            {channel.url.includes('instagram.com') && <FaInstagram />}
            {channel.url.includes('afreecatv.com') && (
              <Text color="GrayText" fontSize="xs">
                아프리카TV
              </Text>
            )}
            <Link isExternal maxW={150} noOfLines={1} fontSize={{ base: 'sm', md: 'md' }}>
              {channel.url}
            </Link>
          </Box>
        ))}
      </Flex>
      <Box mt={2}>
        <Text whiteSpace="break-spaces" maxW={400} fontSize={{ base: 'sm', md: 'md' }}>
          {promotinoPage?.comment}
        </Text>
      </Box>
    </Flex>
  );
}

interface PromotionPageGoodsListProps {
  broadcasterId: number | string;
}
function PromotionPageGoodsList({
  broadcasterId,
}: PromotionPageGoodsListProps): JSX.Element {
  const take = useBreakpointValue({ base: 3, sm: 2, md: 3 });
  // 상품홍보 상품 목록 조회
  const {
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    isLoading,
    data: promotionItems,
  } = usePromotionPageGoods(broadcasterId, { take });

  // ref 전달한 더보기버튼이 화면에 들어왔는지 확인하여 다음목록 요청
  const { ref, inView } = useInView({ threshold: 1 });
  useEffect(() => {
    if (inView) fetchNextPage();
  }, [fetchNextPage, inView]);

  // 라이브쇼핑 상품 조회
  const liveShopping = useLiveShoppingNowPlaying(broadcasterId);

  return (
    <Box>
      <Box mt={30}>
        {liveShopping.data && liveShopping.data.length > 0 && (
          <Box>
            <Text as="h5" fontSize="xl" fontWeight="bold">
              현재 라이브 진행중 상품
            </Text>
            <SimpleGrid mt={4} columns={[1, 2, 3]} spacing={4}>
              {liveShopping.data?.map((x) => (
                <PromotinoPageGoodsDisplay key={x.goodsId} item={x} isLive />
              ))}
            </SimpleGrid>
          </Box>
        )}

        <Box mt={10}>
          <Text as="h5" fontSize="xl" fontWeight="bold">
            홍보중 상품
          </Text>
          <SimpleGrid mt={4} columns={[1, 2, 3]} spacing={4}>
            {promotionItems &&
              promotionItems.pages.map((page, idx) => (
                <Fragment key={idx}>
                  {page.productPromotions.map((promotionItem) => (
                    <PromotinoPageGoodsDisplay
                      key={promotionItem.id}
                      item={promotionItem}
                      isLive={liveShopping.data?.some(
                        (ls) => ls.goodsId === promotionItem.goods.id,
                      )}
                    />
                  ))}
                </Fragment>
              ))}
          </SimpleGrid>
        </Box>
      </Box>

      {hasNextPage && (
        <Center mt={10}>
          <Button
            ref={ref}
            isLoading={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            더보기
          </Button>
        </Center>
      )}

      {isLoading || (isFetching && !isFetchingNextPage) ? (
        <Center mt={10}>
          <Spinner />
        </Center>
      ) : null}
    </Box>
  );
}

export default BroadcasterPromotionPage;
interface PromotinoPageGoodsDisplayProps {
  item: {
    goods: {
      id: number;
      image: { image: string }[];
      summary?: string;
      goods_name: string;
      options: PromotionPagePromotionGoods['goods']['options'];
    };
  };
  isLive?: boolean;
}
function PromotinoPageGoodsDisplay({
  item,
  isLive,
}: PromotinoPageGoodsDisplayProps): JSX.Element | null {
  const defaultOpt = item.goods.options.find((x) => x.default_option === 'y');
  if (!defaultOpt) return null;
  return (
    <LinkBox pos="relative">
      <MotionBox whileHover="hover">
        <GoodsDisplayImage
          border={isLive ? '2px solid red' : undefined}
          alt={item.goods.goods_name}
          src={item.goods.image.find((i) => i.image)?.image || ''}
          ratio={1}
          imageProps={{
            variants: { hover: { scale: 1.05 } },
          }}
        />

        <Box py={2} px={1}>
          <NextLink href={`/goods/${item.goods.id}?bc=1&isLive=true`} passHref>
            <LinkOverlay>
              <Text noOfLines={1}>
                {isLive && (
                  <Badge variant="solid" colorScheme="red" mr={1}>
                    LIVE
                  </Badge>
                )}
                {item.goods.goods_name}
              </Text>
            </LinkOverlay>
          </NextLink>
          <Text color="GrayText" fontSize="sm" noOfLines={1}>
            {item.goods.summary}
          </Text>

          <Box>
            <Flex fontSize="xl" gap={2} maxW={270}>
              <Text>
                <Text as="span" color="red">
                  {getDiscountedRate(
                    Number(defaultOpt.consumer_price),
                    Number(defaultOpt.price),
                  )}
                  %
                </Text>{' '}
                {getLocaleNumber(defaultOpt.price)}원{' '}
                <RedLinedText color="GrayText" as="span" fontSize="sm">
                  {getLocaleNumber(defaultOpt.consumer_price)}원
                </RedLinedText>
              </Text>
            </Flex>
          </Box>
        </Box>
      </MotionBox>
    </LinkBox>
  );
}
