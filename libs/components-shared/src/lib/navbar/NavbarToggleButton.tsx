import { CloseIcon, HamburgerIcon } from '@chakra-ui/icons';
import { IconButton, IconButtonProps } from '@chakra-ui/react';

/**
 * 네비바에 사용하기 위한 토글버튼. open 상태에 따라  closeIcon 혹은 햄버거 아이콘 표시
 * @param isOpen true인 경우 closeIcon, false인 경우 햄버거 아이콘 표시
 * @returns
 */
export function NavbarToggleButton({
  onToggle,
  isOpen,
  size = 'md',
}: {
  onToggle: () => void;
  isOpen: boolean;
  size?: IconButtonProps['size'];
}): JSX.Element {
  return (
    <IconButton
      size={size}
      onClick={onToggle}
      icon={isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />}
      variant="ghost"
      aria-label="Toggle Navigation"
    />
  );
}
