import { Box, Center, SimpleGrid, Spinner, Text } from '@chakra-ui/react';
import KkshowLayout from '@project-lc/components-web-kkshow/KkshowLayout';
import { BestBroadcasterItem } from '@project-lc/components-web-kkshow/main/KkshowMainBestBroadcaster';
import {
  getKkshowBcList,
  kkshowBcListQueryKey,
  useKkshowBcList,
} from '@project-lc/hooks';
import { createQueryClient } from '@project-lc/utils-frontend';
import { GetStaticProps } from 'next';
import { dehydrate, DehydratedState } from 'react-query';

type KkshowBroadcasterListIndexProps = { dehydratedState: DehydratedState };
export const getStaticProps: GetStaticProps<
  KkshowBroadcasterListIndexProps
> = async () => {
  const queryClient = createQueryClient();
  await queryClient.prefetchQuery(kkshowBcListQueryKey, getKkshowBcList).catch((err) => {
    throw new Error(`Failed to fetch KkshowBroadcasterList data - ${err}`);
  });
  return {
    props: { dehydratedState: dehydrate(queryClient) },
    revalidate: 60,
  };
};

export function KkshowBroadcasterListIndex(): JSX.Element {
  return (
    <KkshowLayout navbarFirstLink="kkshow">
      <Box m="auto" maxW="5xl" p={2} minH="80vh" mt={[5, 10, 20]}>
        <Center mb={12}>
          <Text fontWeight="bold" fontSize="lg">
            크크쇼와 함께하는 방송인
          </Text>
        </Center>
        <BroadcasterList />
      </Box>
    </KkshowLayout>
  );
}

export default KkshowBroadcasterListIndex;

function BroadcasterList(): JSX.Element {
  const { data, isLoading } = useKkshowBcList();
  if (isLoading)
    return (
      <Center>
        <Spinner />
      </Center>
    );

  return (
    <SimpleGrid columns={[3, 4, 5]} gap={8} rowGap={16}>
      {data?.map((bc) => (
        <BestBroadcasterItem
          key={bc.id}
          broadcasterId={bc.broadcasterId}
          avatarUrl={bc.profileImage}
          broadcasterName={bc.nickname}
          href={bc.href}
        />
      ))}
    </SimpleGrid>
  );
}
