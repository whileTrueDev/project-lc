import { Button } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { useDisplaySize } from '@project-lc/hooks';
import { openKakaoChannel } from '@project-lc/utils-frontend';

interface FloatingHelpButtonProps {
  bottom?: string | number;
}
export function FloatingHelpButton({
  bottom = '10px',
}: FloatingHelpButtonProps): JSX.Element {
  const { isMobileSize } = useDisplaySize();
  if (isMobileSize) {
    return (
      <Button
        variant="unstyled"
        position="fixed"
        right="10px"
        bottom={bottom}
        width="55px"
        height="55px"
        zIndex="tooltip"
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
      bottom={bottom}
      width={270.5}
      height={50}
      onClick={openKakaoChannel}
      zIndex="tooltip"
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
