import { Box } from '@chakra-ui/react';
import { StreamingService } from '@prisma/client';
import { useMemo } from 'react';

export interface KkshowLiveEmbedDisplayProps {
  streamingService: StreamingService;
  UID: string;
}
export function KkshowLiveEmbedDisplay({
  streamingService,
  UID,
}: KkshowLiveEmbedDisplayProps): JSX.Element | null {
  const url = useMemo(() => {
    if (streamingService === 'twitch') {
      return [
        `https://player.twitch.tv?channel=${UID}`,
        'parent=localhost',
        'muted=false',
      ].join('&');
    }

    if (streamingService === 'afreeca') {
      return `https://play.afreecatv.com/${UID}/embed`;
    }

    return null;
  }, [UID, streamingService]);

  if (!url) return null;
  return (
    <Box pos="relative" paddingTop="56.5%" width="100%">
      <iframe
        title={`${streamingService}/${UID}/임베드`}
        src={url}
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        height="100%"
        width="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </Box>
  );
}

export default KkshowLiveEmbedDisplay;
