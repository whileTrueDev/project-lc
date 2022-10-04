import { Center, Text } from '@chakra-ui/react';
import { StreamingService } from '@prisma/client';
import { useMemo } from 'react';

export interface KkshowLiveChattingProps {
  streamingService: StreamingService;
  UID: string;
}
export function KkshowLiveChatting({
  UID,
  streamingService,
}: KkshowLiveChattingProps): JSX.Element | null {
  const url = useMemo(() => {
    if (streamingService === 'twitch') {
      const URL = window?.location?.hostname;
      return [
        `https://www.twitch.tv/embed/${UID}/chat?parent=${URL}`,
        'muted=false',
      ].join('&');
    }

    if (streamingService === 'afreeca') {
      return null;
    }

    return null;
  }, [UID, streamingService]);

  if (!url)
    return (
      <Center p={4} height="100%" textAlign="center">
        <Text>아프리카TV 라이브 방송은 아직 채팅 기능이 제공되지 않습니다.</Text>
      </Center>
    );

  return (
    <iframe
      title="채팅"
      id="chat_embed"
      src={url}
      height="100%"
      width="100%"
      style={{ minHeight: '500px' }}
    />
  );
}

export default KkshowLiveChatting;
