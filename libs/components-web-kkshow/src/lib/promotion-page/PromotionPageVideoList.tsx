import { Box, Center, Heading, Link, SimpleGrid, Stack } from '@chakra-ui/react';
import BorderedAvatar from '@project-lc/components-core/BorderedAvatar';
import EmbededVideo from '@project-lc/components-shared/EmbededVideo';
import { useLiveShoppingList } from '@project-lc/hooks';
import { LiveShoppingWithGoods } from '@project-lc/shared-types';
import { getKkshowWebHost } from '@project-lc/utils';
import { useMemo } from 'react';

export interface PromotionPageVideoListProps {
  broadcasterId: number | string;
}
export function PromotionPageVideoList({
  broadcasterId,
}: PromotionPageVideoListProps): JSX.Element {
  const { data: liveShoppingList } = useLiveShoppingList(
    { broadcasterId: Number(broadcasterId) },
    { enabled: !!broadcasterId },
  );

  const lsHavingVideo = useMemo(() => {
    if (!liveShoppingList || !liveShoppingList.length) return [];
    return liveShoppingList.filter((ls) => !!ls.liveShoppingVideo);
  }, [liveShoppingList]);
  return (
    <Stack>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {lsHavingVideo.map((ls) => (
          <PromotionPageVideoItem key={ls.id} liveShopping={ls} />
        ))}
      </SimpleGrid>
    </Stack>
  );
}

export default PromotionPageVideoList;

function PromotionPageVideoItem({
  liveShopping,
}: {
  liveShopping: LiveShoppingWithGoods;
}): JSX.Element {
  const identifier = liveShopping.liveShoppingVideo.youtubeUrl.replace(
    'https://youtu.be/',
    '',
  );
  // 라이브 쇼핑명
  const liveShoppingTitle = liveShopping.liveShoppingName;
  // 상품이미지 url (외부상품으로 진행한 경우 상품이미지가 없다)
  const goodsImageUrl = liveShopping.goods
    ? liveShopping.goods.image[0]?.image
    : undefined;
  // 상품페이지 url
  const goodsLinkUrl = liveShopping.goods
    ? `${getKkshowWebHost()}/goods/${liveShopping.goodsId}`
    : liveShopping.externalGoods?.linkUrl;
  return (
    <Center>
      <Box
        rounded="2xl"
        w="100%"
        maxW="lg"
        bgColor="gray.100"
        color="blackAlpha.900"
        boxShadow="lg"
      >
        <Box h={{ base: 230, md: 300 }} className="livecard-embed-container">
          <EmbededVideo provider="youtube" identifier={identifier} />
        </Box>

        <Stack direction="row" justify="space-between" alignItems="center" p={4}>
          <Heading fontSize={{ base: 'lg', md: '2xl' }} noOfLines={2}>
            {liveShoppingTitle}
          </Heading>
          <Link href={goodsLinkUrl} isExternal>
            <BorderedAvatar src={goodsImageUrl} size="lg" />
          </Link>
        </Stack>
      </Box>
    </Center>
  );
}
