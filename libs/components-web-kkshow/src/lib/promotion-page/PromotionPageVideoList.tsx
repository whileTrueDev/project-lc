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

  if (lsHavingVideo.length === 0) {
    return <Center py={{ base: 10, md: 20 }}>아직 등록된 영상이 없습니다</Center>;
  }
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

  const { imageUrl, linkUrl } = useMemo(() => {
    const goodsData = {
      imageUrl: '',
      linkUrl: '',
    };
    // 크크쇼 상품으로 진행한 라이브쇼핑
    if (liveShopping.goods) {
      goodsData.imageUrl = liveShopping.goods.image[0]?.image;
      goodsData.linkUrl = `${getKkshowWebHost()}/goods/${liveShopping.goodsId}`;
    } else if (liveShopping.externalGoods) {
      // 외부상품으로 진행한 라이브쇼핑
      goodsData.imageUrl = liveShopping.externalGoods?.imageUrl || '';
      goodsData.linkUrl = liveShopping.externalGoods?.linkUrl;
    }
    return goodsData;
  }, [liveShopping.externalGoods, liveShopping.goods, liveShopping.goodsId]);

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
          <Link href={linkUrl} isExternal>
            <BorderedAvatar src={imageUrl} size="lg" />
          </Link>
        </Stack>
      </Box>
    </Center>
  );
}
