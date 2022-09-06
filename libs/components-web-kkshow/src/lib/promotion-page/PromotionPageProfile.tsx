/* eslint-disable react/no-array-index-key */
import {
  Avatar,
  Box,
  Flex,
  Grid,
  GridItem,
  Image,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react';
import {
  useBroadcaster,
  useBroadcasterChannels,
  usePromotionPage,
  usePromotionPageRanking,
} from '@project-lc/hooks';
import { GetRankingBy } from '@project-lc/shared-types';
import { getLocaleNumber } from '@project-lc/utils-frontend';
import { Fragment, useState } from 'react';
import { FaInstagram, FaTwitch, FaYoutube } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

interface PromotionPageProfileProps {
  broadcasterId: number | string;
}
export function PromotionPageProfile({
  broadcasterId,
}: PromotionPageProfileProps): JSX.Element {
  const bc = useBroadcaster({ id: broadcasterId });
  const channels = useBroadcasterChannels(Number(broadcasterId));
  const { data: promotinoPage } = usePromotionPage(broadcasterId);
  const getChannelLinkImage = (channelUrl: string): React.ReactNode => {
    if (channelUrl.includes('twitch.tv') || channelUrl.includes('twitch.com')) {
      return <FaTwitch color="purple" />;
    }
    if (channelUrl.includes('youtube.com')) return <FaYoutube color="red" />;
    if (channelUrl.includes('instagram.com')) return <FaInstagram />;
    if (channelUrl.includes('afreecatv.com'))
      return (
        <Image draggable={false} src="/images/logo/icon-afreecatv-24.png" w="18px" />
      );
    return <FiExternalLink />;
  };
  return (
    <Flex justify="space-evenly" display={{ base: 'block', sm: 'flex' }}>
      <Flex
        justifyContent="center"
        display="flex"
        alignItems="center"
        flexDir="column"
        gap={2}
      >
        <Avatar
          h={{ base: 20, md: 40 }}
          w={{ base: 20, md: 40 }}
          src={bc.data?.avatar || ''}
        />
        <Text fontSize="2xl">{bc.data?.userNickname}</Text>
        {promotinoPage?.comment && (
          <Box mt={2} maxW="xl" w="100%">
            <Text fontWeight="bold">방송인 소개</Text>
            <Text whiteSpace="break-spaces" fontSize={{ base: 'sm', md: 'md' }}>
              {promotinoPage.comment}
            </Text>
          </Box>
        )}

        {channels.data && (
          <Box my={4} gap={4} maxW="xl" w="100%">
            {channels.data?.map((channel) => (
              <Flex justify="flex-start" align="center" gap={2} key={channel.id}>
                {getChannelLinkImage(channel.url)}
                <Link
                  isExternal
                  href={channel.url}
                  noOfLines={1}
                  fontSize={{ base: 'sm', md: 'md' }}
                >
                  채널바로가기
                </Link>
              </Flex>
            ))}
          </Box>
        )}
      </Flex>

      <PromotionPageRanking broadcasterId={broadcasterId} />
    </Flex>
  );
}

export default PromotionPageProfile;

export function PromotionPageRanking({
  broadcasterId,
}: PromotionPageProfileProps): JSX.Element | null {
  const medals = ['🥇', '🥈', '🥉'];
  const [by, setBy] = useState<GetRankingBy>(GetRankingBy.purchasePrice);
  const onByChange = (newBy: GetRankingBy): void => {
    setBy(newBy);
  };
  const { data } = usePromotionPageRanking(Number(broadcasterId), { by });

  return (
    <Box
      minHeight="200px"
      height="100%"
      width="300px"
      borderWidth="thin"
      rounded="md"
      p={2}
      overflow="hidden"
    >
      <Tabs
        fontSize={{ base: 'sm', md: 'md' }}
        onChange={(idx) => {
          onByChange(
            // eslint-disable-next-line no-nested-ternary
            idx === 0
              ? GetRankingBy.purchasePrice
              : idx === 1
              ? GetRankingBy.giftPrice
              : GetRankingBy.reviewCount,
          );
        }}
      >
        <TabList>
          <Tab p={2} fontSize={{ base: 'sm', md: 'md' }}>
            구매순위
          </Tab>
          <Tab p={2} fontSize={{ base: 'sm', md: 'md' }}>
            선물순위
          </Tab>
          <Tab p={2} fontSize={{ base: 'sm', md: 'md' }}>
            후기순위
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Grid gridTemplateColumns="2fr 1fr" gap={1}>
              {data?.length === 0 && <Text>아직 구매 내역이 없습니다.</Text>}
              {data &&
                data?.length > 0 &&
                data?.map((rank, idx) => (
                  <Fragment key={rank.nickname}>
                    <GridItem>
                      <Text noOfLines={1}>
                        {medals[idx]} {rank.nickname}
                      </Text>
                    </GridItem>
                    <GridItem textAlign="right">
                      <Text noOfLines={1}>{getLocaleNumber(rank._sum?.price)}원</Text>
                    </GridItem>
                  </Fragment>
                ))}
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid gridTemplateColumns="2fr 1fr" gap={1}>
              {data?.length === 0 && <Text>아직 선물 내역이 없습니다.</Text>}
              {data &&
                data?.length > 0 &&
                data?.map((rank, idx) => (
                  <Fragment key={rank.nickname}>
                    <GridItem>
                      <Text noOfLines={1}>
                        {medals[idx]} {rank.nickname}
                      </Text>
                    </GridItem>
                    <GridItem textAlign="right">
                      <Text noOfLines={1}>{getLocaleNumber(rank._sum?.price)}원</Text>
                    </GridItem>
                  </Fragment>
                ))}
            </Grid>
          </TabPanel>

          <TabPanel>
            <Grid gridTemplateColumns="4fr 1fr" gap={1}>
              {data?.length === 0 && <Text>아직 후기 내역이 없습니다.</Text>}
              {data &&
                data?.length > 0 &&
                data?.map((rank, idx) => (
                  <Fragment key={rank.nickname}>
                    <GridItem>
                      <Text noOfLines={1}>
                        {medals[idx]} {rank.nickname}
                      </Text>
                    </GridItem>
                    <GridItem textAlign="right">
                      <Text noOfLines={1}>{getLocaleNumber(rank._count)}개</Text>
                    </GridItem>
                  </Fragment>
                ))}
            </Grid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
}
