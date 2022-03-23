import { Box, BoxProps } from '@chakra-ui/react';
import { useMyLocationOrigin } from '@project-lc/hooks';
import { nanoid } from 'nanoid';
import { memo, useEffect, useRef } from 'react';

const TWITCH_EMBED_SCRIPT = 'https://embed.twitch.tv/embed/v1.js';

type OnTwitchStateChange = (status: 'play' | 'pause' | 'ready' | 'ended') => void;

export interface TwitchLiveEmbedProps extends BoxProps {
  channel: string;
  height?: React.HTMLProps<HTMLDivElement>['height'];
  width?: React.HTMLProps<HTMLDivElement>['width'];
  onTwitchStateChange?: OnTwitchStateChange;
}
export function TwitchLiveEmbed({
  channel,
  height = 400,
  width = 400,
  onTwitchStateChange,
  ...rest
}: TwitchLiveEmbedProps): JSX.Element {
  const id = `kkshow-twitch-embed-video-${nanoid(3)}`;
  const myOrigin = useMyLocationOrigin();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) containerRef.current.innerHTML = '';
    if (myOrigin) {
      const script = document.createElement('script');
      script.setAttribute('src', TWITCH_EMBED_SCRIPT);
      script.addEventListener('load', () => {
        const twitchEmbed = new (window as unknown as any).Twitch.Embed(id, {
          layout: 'video',
          channel,
          width,
          height,
          parent: [myOrigin],
          autoplay: false,
        });

        const { PLAY, PAUSE, READY, ENDED } = (window as unknown as any).Twitch.Embed;
        if (onTwitchStateChange) {
          twitchEmbed.addEventListener(PLAY, () => onTwitchStateChange('play'));
          twitchEmbed.addEventListener(PAUSE, () => onTwitchStateChange('pause'));
          twitchEmbed.addEventListener(READY, () => onTwitchStateChange('ready'));
          twitchEmbed.addEventListener(ENDED, () => onTwitchStateChange('ended'));
        }

        if (twitchEmbed && twitchEmbed._iframe) {
          twitchEmbed._iframe.style.borderRadius = '8px';
        }
      });
      document.body.append(script);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, height, myOrigin, width]);

  return <Box ref={containerRef} id={id} h="100%" {...rest} />;
}

export default memo(TwitchLiveEmbed);
