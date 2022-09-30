/* eslint-disable react/no-array-index-key */
import { Box, Button, Center, Flex, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import { useInfiniteLiveShoppingVideo } from '@project-lc/hooks';
import { LiveShoppingVideoRes } from '@project-lc/shared-types';
import dayjs from 'dayjs';
import { Fragment, useMemo } from 'react';

export function RecentLiveVideoList(): JSX.Element {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isFetching } =
    useInfiniteLiveShoppingVideo({ skip: 0, take: 2 });
  return (
    <Box>
      <SimpleGrid columns={[2]} gap={4}>
        {data?.pages.map((page, index) => (
          <Fragment key={index}>
            {page.edges.map((video) => (
              <RecentLiveVideo key={video.id} {...video} />
            ))}
          </Fragment>
        ))}
      </SimpleGrid>

      {hasNextPage && (
        <Center>
          <Button isLoading={isFetchingNextPage} onClick={() => fetchNextPage()}>
            더보기
          </Button>
        </Center>
      )}

      {isFetching && !isFetchingNextPage ? (
        <Center>
          <Spinner />
        </Center>
      ) : null}
    </Box>
  );
}

export default RecentLiveVideoList;

export type RecentLiveVideoProps = LiveShoppingVideoRes;
export function RecentLiveVideo(video: RecentLiveVideoProps): JSX.Element | null {
  const liveShopping = useMemo(() => video.LiveShopping[0], [video.LiveShopping]);
  const embedUrl = useMemo(() => {
    if (!video.youtubeUrl) return '';
    const videoCode = video.youtubeUrl
      ?.replace('https://www.youtube.com/embed/', '')
      .replace('https://www.youtube.com/', '')
      .replace('https://youtu.be/', '');
    return `https://www.youtube.com/embed/${videoCode}`;
  }, [video.youtubeUrl]);

  if (!embedUrl) return null;
  return (
    <Box key={video.id}>
      <iframe
        width="100%"
        height="315"
        src={embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
      <Flex gap={2} my={4} mx={2}>
        {liveShopping && (
          <Box>
            <Text fontSize="sm" color="GrayText">
              {dayjs(liveShopping.broadcastStartDate).format('YYYY. MM. DD')}
            </Text>
            <Text>{liveShopping.liveShoppingName}</Text>
            <Text color="GrayText">
              {liveShopping.broadcaster.userNickname} +{' '}
              {liveShopping.seller.sellerShop.shopName}
            </Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
