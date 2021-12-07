import { Button } from '@chakra-ui/react';
import { useDisplaySize } from '@project-lc/hooks';
import { openKakaoChannel } from '@project-lc/utils';
import { ChakraNextImage } from '..';

export function FloatingHelpButton(): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  if (isMobileSize) {
    return (
      <Button
        variant="unstyled"
        position="fixed"
        right="10px"
        bottom="10px"
        width="55px"
        height="55px"
        onClick={openKakaoChannel}
      >
        <ChakraNextImage src="/images/liveContact.svg" width="55px" height="55px" />
      </Button>
    );
  }
  return (
    <Button
      variant="unstyled"
      position="fixed"
      right="10px"
      bottom="10px"
      width={270.5}
      height={50}
      onClick={openKakaoChannel}
    >
      <ChakraNextImage
        src="/images/liveContactSpreaded.png"
        width="270.5px"
        height="50px"
      />
    </Button>
  );
}

export default FloatingHelpButton;
