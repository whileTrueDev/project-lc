import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Button, ButtonProps, useColorModeValue } from '@chakra-ui/react';

export interface ShowMoreTextButtonProps {
  onClick: () => void;
  isOpen?: boolean;
  size?: ButtonProps['size'];
}
export function ShowMoreTextButton({
  onClick,
  isOpen = false,
  size = 'md',
}: ShowMoreTextButtonProps): JSX.Element {
  const buttonText = useColorModeValue('#1a202c', '#ffffffeb');
  return (
    <Button
      size={size}
      variant="link"
      color={buttonText}
      textDecoration="underline"
      rightIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
      onClick={onClick}
    >
      자세히 보기
    </Button>
  );
}

export default ShowMoreTextButton;
