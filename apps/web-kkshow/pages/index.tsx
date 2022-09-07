import { Box } from '@chakra-ui/react';
import {
  ChuseokDeliveryPopup,
  SignupEventPopup,
} from '@project-lc/components-web-kkshow/EventPopup';
import { KkshowLayout } from '@project-lc/components-web-kkshow/KkshowLayout';
import { KkshowMainBestBroadcaster } from '@project-lc/components-web-kkshow/main/KkshowMainBestBroadcaster';
import { KkshowMainBestLive } from '@project-lc/components-web-kkshow/main/KkshowMainBestLive';
import { KkshowMainCarousel } from '@project-lc/components-web-kkshow/main/KkshowMainCarousel';
import { KkshowLiveTeaser } from '@project-lc/components-web-kkshow/main/KkshowMainLiveTeaser';
import { KkshowMainPlusFriend } from '@project-lc/components-web-kkshow/main/KkshowMainPlusFriend';
import { getKkshowMain, kkshowMainQueryKey } from '@project-lc/hooks';
import { createQueryClient } from '@project-lc/utils-frontend';
import { GetStaticProps } from 'next';
import { dehydrate, DehydratedState } from 'react-query';

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
    <Box position="relative">
      {/* subnav sticky 적용 위해 동그라미들 감싸는 컨테이너에만 overflow:hidden 적용 */}
      <Box overflow="hidden" position="absolute" width="100%" minHeight="1000px">
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
          top={{ base: 300, sm: 470, md: 550 }}
          left={-75}
          zIndex={1}
        />
        <Box
          pos="absolute"
          backgroundImage="images/main/bg-circle-3.png"
          backgroundSize="contain"
          w={{ base: 150, md: 300 }}
          h={{ base: 150, md: 300 }}
          top={{ base: 440, sm: 600, md: 700 }}
          right={{ base: -75, md: -150 }}
          zIndex={1}
        />
      </Box>

      {/* 신규가입 이벤트 팝업 */}
      <SignupEventPopup />
      {/* 추석 배송 안내 팝업 */}
      <ChuseokDeliveryPopup />

      <KkshowLayout>
        <KkshowMainCarousel />
        <KkshowLiveTeaser />
        <KkshowMainBestLive />
        <KkshowMainPlusFriend />
        <KkshowMainBestBroadcaster />
      </KkshowLayout>
    </Box>
  );
}
