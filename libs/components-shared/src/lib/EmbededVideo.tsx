import { LivePlatform } from '@project-lc/shared-types';
import { useEffect, useState } from 'react';
import Youtube from 'react-youtube';
import { YouTubePlayer } from 'youtube-player/dist/types';

type YoutubeStates = 0 | 1 | 2 | 3 | 5 | -1;
export interface EmbededVideoProps {
  provider: LivePlatform;
  /**
   * if provider is twitch, identifier means channelName
   * if provider is youtube, identifier means youtube's video-id
   * */
  identifier: string;
  onYoutubeStateChange?: (
    identifier: string,
    e: {
      youtubePlayer: YouTubePlayer;
      data: YoutubeStates;
    },
  ) => void;
}
export function EmbededVideo({
  provider,
  identifier,
  onYoutubeStateChange,
}: EmbededVideoProps): JSX.Element | null {
  const [myLocationOrigin, setMyLocationHost] = useState('');
  useEffect(() => {
    if (typeof window !== undefined) {
      setMyLocationHost(window.location.hostname);
    }
  }, []);

  if (provider === 'youtube') {
    return (
      <Youtube
        containerClassName="main-carousel-youtube-container"
        className="main-carousel-youtube-video"
        loading="eager"
        opts={{
          height: '100%',
          width: '100%',
          playerVars: {
            autoplay: 0, // 자동 재생 여부 1,0
            controls: 1, // 동영상 재생 표시줄 1,0
            color: 'red', // 동영상 표시줄 색상 white, red
            fs: 0, // 전체화면 가능/불가 1,0
            modestbranding: 1, // 재생표시줄 유튜브 로고 숨기기 1, 숨기지않기 undefined
            rel: 0, // 관련동영상 타입 0 = 현재 영상의 채널의 동영상중, 1 = 영상과 관련된 아무거나
            playsinline: 1, // IOS에서 전체화면으로 재생되지 않고 바로 재생될수있도록할지 1,0
          },
        }}
        videoId={identifier}
        title={`YouTube video player - ${identifier}`}
        onStateChange={
          onYoutubeStateChange
            ? (e) =>
                onYoutubeStateChange(identifier, {
                  data: e.data as YoutubeStates,
                  youtubePlayer: e.target,
                })
            : undefined
        }
      />
    );
  }

  if (provider === 'twitch' && myLocationOrigin) {
    return (
      <iframe
        style={{ borderRadius: '8px' }}
        title={`Twitch video player - ${identifier}`}
        src={`https://player.twitch.tv/?channel=${identifier}&parent=${myLocationOrigin}`}
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
