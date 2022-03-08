import { LivePlatform } from '@project-lc/shared-types';
import { HTMLAttributes, useEffect, useState } from 'react';

export interface EmbededVideoProps {
  provider: LivePlatform;
  /**
   * if provider is twitch, identifier means channelName
   * if provider is youtube, identifier means youtube's video-id
   * */
  identifier: string;
  style?: HTMLAttributes<HTMLIFrameElement>['style'];
}
export function EmbededVideo({
  provider,
  identifier,
  style,
}: EmbededVideoProps): JSX.Element | null {
  const [myLocaitonOrigin, setMyLocationHost] = useState('');
  useEffect(() => {
    if (typeof window !== undefined) {
      setMyLocationHost(window.location.hostname);
    }
  }, []);

  if (provider === 'youtube') {
    return (
      <iframe
        style={style || { borderRadius: '8px' }}
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${identifier}?controls=0`}
        title={`YouTube video player - ${identifier}`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (provider === 'twitch') {
    return (
      <iframe
        style={style}
        title={`Twitch video player - ${identifier}`}
        src={`https://player.twitch.tv/?channel=${identifier}&parent=${myLocaitonOrigin}`}
        frameBorder="0"
        allowFullScreen
        scrolling="no"
        height="100%"
        width="100%"
      />
    );
  }
  return null;
}

export default EmbededVideo;
