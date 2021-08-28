import { ChevronRightIcon } from '@chakra-ui/icons';
import { Button, useColorModeValue, theme } from '@chakra-ui/react';

export function ShowMoreTextButton(): JSX.Element {
  const buttonText = useColorModeValue('#1a202c', '#ffffffeb');
  return (
    <Button
      size="sm"
      variant="link"
      color={buttonText}
      textDecoration="underline"
      rightIcon={<ChevronRightIcon />}
    >
      자세히 보기
    </Button>
  );
}

export default ShowMoreTextButton;
