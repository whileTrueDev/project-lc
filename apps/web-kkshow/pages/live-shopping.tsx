/* eslint-disable react/no-array-index-key */
import { Box, Center, Divider, Grid, GridItem, Spinner, Text } from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import KkshowLiveChatting from '@project-lc/components-web-kkshow/main/live-embed/KkshowLiveChatting';
import KkshowLiveEmbedDisplay from '@project-lc/components-web-kkshow/main/live-embed/KkshowLiveEmbedDisplay';
import KkshowLiveLiveDisplay from '@project-lc/components-web-kkshow/main/live-embed/KkshowLiveLiveDisplay';
import { RecentLiveVideoList } from '@project-lc/components-web-kkshow/main/live-embed/RecentLiveVideoList';
import { useLiveEmbedList } from '@project-lc/hooks';

export default function LiveShoppingPage(): JSX.Element {
  const { data, isLoading } = useLiveEmbedList();
  if (isLoading)
    return (
      <KkshowLayout>
        <Center my={20}>
          <Spinner />
        </Center>
      </KkshowLayout>
    );
  if (!data || (data && data.length === 0))
    return (
      <KkshowLayout>
        <Box maxWidth="5xl" mx="auto" p={4} minH="600px">
          <Center my={10}>
            <Text fontSize="lg">현재 시청할 수 있는 라이브가 없습니다.</Text>
          </Center>
          <Divider />
          <Box my={8}>
            <Center my={4}>
              <Text fontSize="lg" fontWeight="bold">
                지난 라이브 영상
              </Text>
            </Center>
            <RecentLiveVideoList />
          </Box>
        </Box>
      </KkshowLayout>
    );
  return (
    <KkshowLayout>
      <Grid
        minH="calc(100vh - 155px)"
        templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '10fr 3fr', xl: '10fr 3fr' }}
        templateRows={{ base: '1fr', lg: '4fr 1fr' }}
      >
        <GridItem position="relative" colSpan={{ base: 2, lg: 'auto' }}>
          <KkshowLiveEmbedDisplay
            UID={data[0].UID}
            streamingService={data[0].streamingService}
          />
        </GridItem>

        <GridItem
          order={{ base: 2, lg: 'unset' }}
          colSpan={{ base: 2, md: 'auto' }}
          rowSpan={2}
        >
          <KkshowLiveChatting
            UID={data[0].UID}
            streamingService={data[0].streamingService}
          />
        </GridItem>

        <GridItem order={1}>
          <KkshowLiveLiveDisplay
            liveShoppingId={data[0].liveShoppingId}
            UID={data[0].UID}
            streamingService={data[0].streamingService}
          />
        </GridItem>
      </Grid>
    </KkshowLayout>
  );
}
