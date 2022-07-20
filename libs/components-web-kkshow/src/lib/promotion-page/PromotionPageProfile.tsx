/* eslint-disable react/no-array-index-key */
import { Avatar, Box, Flex, Image, Link, Text } from '@chakra-ui/react';
import {
  useBroadcaster,
  useBroadcasterChannels,
  usePromotionPage,
} from '@project-lc/hooks';
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
    if (channelUrl.includes('twitch.com')) return <FaTwitch color="purple" />;
    if (channelUrl.includes('youtube.com')) return <FaYoutube color="red" />;
    if (channelUrl.includes('instagram.com')) return <FaInstagram />;
    if (channelUrl.includes('afreecatv.com'))
      return (
        <Image draggable={false} src="/images/logo/icon-afreecatv-24.png" w="18px" />
      );
    return <FiExternalLink />;
  };
  return (
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
  );
}

export default PromotionPageProfile;
