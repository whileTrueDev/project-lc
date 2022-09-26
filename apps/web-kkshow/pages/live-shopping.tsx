import { Box, Grid, GridItem } from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import KkshowLiveChatting from '@project-lc/components-web-kkshow/main/live-embed/KkshowLiveChatting';
import KkshowLiveEmbedDisplay from '@project-lc/components-web-kkshow/main/live-embed/KkshowLiveEmbedDisplay';
import KkshowLiveLiveDisplay from '@project-lc/components-web-kkshow/main/live-embed/KkshowLiveLiveDisplay';
import { useLiveEmbedList } from '@project-lc/hooks';

export default function LiveShoppingPage(): JSX.Element {
  const { data } = useLiveEmbedList();
  if (!data || (data && data.length === 0)) return <Box>데이터 없는 경우</Box>;

  return (
    <KkshowLayout>
      <Grid
        minH="calc(100vh - 155px)"
        templateColumns={{ base: '1fr', md: '1fr 1fr', lg: '10fr 3fr', xl: '10fr 3fr' }}
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
