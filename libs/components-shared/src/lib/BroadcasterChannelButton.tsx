import { ExternalLinkIcon } from '@chakra-ui/icons';
import { Tooltip, IconButton, ButtonProps } from '@chakra-ui/react';

export type BroadcasterChannelButtonProps = {
  channelUrl: string | undefined;
} & ButtonProps;
export function BroadcasterChannelButton({
  channelUrl,
  size = 'xs',
  ...buttonProps
}: BroadcasterChannelButtonProps): JSX.Element | null {
  if (!channelUrl) return null;
  return (
    <Tooltip label="방송인 채널로 이동">
      <IconButton
        aria-label="open-broadcaster-channel-button"
        icon={<ExternalLinkIcon />}
        onClick={() => window.open(channelUrl, '_blank')}
        size={size}
        {...buttonProps}
      />
    </Tooltip>
  );
}

export default BroadcasterChannelButton;
