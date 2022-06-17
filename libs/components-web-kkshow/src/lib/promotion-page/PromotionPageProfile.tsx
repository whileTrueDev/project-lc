/* eslint-disable react/no-array-index-key */
import { Avatar, Box, Flex, Link, Text } from '@chakra-ui/react';
import {
  useBroadcaster,
  useBroadcasterChannels,
  usePromotionPage,
} from '@project-lc/hooks';
import { FaInstagram, FaTwitch, FaYoutube } from 'react-icons/fa';

interface PromotionPageProfileProps {
  broadcasterId: number | string;
}
export function PromotionPageProfile({
  broadcasterId,
}: PromotionPageProfileProps): JSX.Element {
  const bc = useBroadcaster({ id: broadcasterId });
  const channels = useBroadcasterChannels(Number(broadcasterId));
  const { data: promotinoPage } = usePromotionPage(broadcasterId);
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
      <Flex my={4} gap={4} maxW="xl" w="100%" justify="space-between">
        {channels.data?.map((channel) => (
          <Flex flexDir="column" justify="space-between" key={channel.id}>
            {channel.url.includes('twitch.com') && <FaTwitch color="purple" />}
            {channel.url.includes('youtube.com') && <FaYoutube color="red" />}
            {channel.url.includes('instagram.com') && <FaInstagram />}
            {channel.url.includes('afreecatv.com') && (
              <Text color="GrayText" fontSize="xs">
                아프리카TV
              </Text>
            )}
            <Link
              isExternal
              href={channel.url}
              maxW={150}
              noOfLines={1}
              fontSize={{ base: 'sm', md: 'md' }}
            >
              {channel.url}
            </Link>
          </Flex>
        ))}
      </Flex>
      {promotinoPage?.comment && (
        <Box mt={2} maxW="xl" w="100%">
          <Text fontWeight="bold">방송인 소개</Text>
          <Text whiteSpace="break-spaces" fontSize={{ base: 'sm', md: 'md' }}>
            {promotinoPage.comment}
          </Text>
        </Box>
      )}
    </Flex>
  );
}

export default PromotionPageProfile;
