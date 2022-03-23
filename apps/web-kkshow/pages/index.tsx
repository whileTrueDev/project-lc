import { Box } from '@chakra-ui/react';
import { kkshowFooterLinkList } from '@project-lc/components-constants/footerLinks';
import { CommonFooter } from '@project-lc/components-layout/CommonFooter';
import { KkshowNavbar } from '@project-lc/components-web-kkshow/KkshowNavbar';
import { KkshowMainBestBroadcaster } from '@project-lc/components-web-kkshow/main/KkshowMainBestBroadcaster';
import { KkshowMainBestLive } from '@project-lc/components-web-kkshow/main/KkshowMainBestLive';
import { KkshowMainCarousel } from '@project-lc/components-web-kkshow/main/KkshowMainCarousel';
import { KKshowMainExternLinks } from '@project-lc/components-web-kkshow/main/KKshowMainExternLinks';
import { KkshowLiveTeaser } from '@project-lc/components-web-kkshow/main/KkshowMainLiveTeaser';
import { KkshowMainPlusFriend } from '@project-lc/components-web-kkshow/main/KkshowMainPlusFriend';
import { BottomQuickMenu } from '@project-lc/components-shared/BottomQuickMenu';
import { getKkshowMain, kkshowMainQueryKey } from '@project-lc/hooks';
import { createQueryClient } from '@project-lc/utils-frontend';
import { GetStaticProps } from 'next';
import { dehydrate, DehydratedState } from 'react-query';
import dynamic from 'next/dynamic';

const TwitchLiveEmbed = dynamic(
  () => import('@project-lc/components-shared/TwitchLiveEmbed'),
  { ssr: false },
);

interface KkshowIndexProps {
  dehydratedState: DehydratedState;
}
export const getStaticProps: GetStaticProps<KkshowIndexProps> = async () => {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery(kkshowMainQueryKey, getKkshowMain).catch((err) => {
    throw new Error(`Failed to fetch KkshowMain data - ${err}`);
  });

  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  };
};

export default function Index(): JSX.Element {
  return (
    <Box overflow="hidden" position="relative">
      <Box
        display={{ base: 'none', md: 'block' }}
        pos="absolute"
        backgroundImage="images/main/bg-circle-1.png"
        backgroundSize="contain"
        w={450}
        h={450}
        top={120}
        right={0}
        zIndex={1}
      />
      <Box
        pos="absolute"
        backgroundImage="images/main/bg-circle-2.png"
        backgroundSize="contain"
        w={{ base: 150, md: 250 }}
        h={{ base: 150, md: 250 }}
        top={{ base: 470, md: 550 }}
        left={-75}
        zIndex={1}
      />
      <Box
        pos="absolute"
        backgroundImage="images/main/bg-circle-3.png"
        backgroundSize="contain"
        w={{ base: 150, md: 300 }}
        h={{ base: 150, md: 300 }}
        top={{ base: 600, md: 700 }}
        right={{ base: -75, md: -150 }}
        zIndex={1}
      />

      <KkshowNavbar />
      <KkshowMainCarousel />
      <KkshowLiveTeaser />
      <KkshowMainBestLive />
      <KkshowMainPlusFriend />
      <KkshowMainBestBroadcaster />

      <BottomQuickMenu />

      <KKshowMainExternLinks mb={-4} bgColor="blue.900" color="whiteAlpha.900" />
      <CommonFooter footerLinkList={kkshowFooterLinkList} />
    </Box>
  );
}
