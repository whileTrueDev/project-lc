import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import MypageSidebar, { MypageSidebarPrpps } from './MypageSidebar';
import { NavbarToggleButton } from './NavbarToggleButton';

interface DesktopSidebMypagearProps extends MypageSidebarPrpps {
  isOpen: boolean;
  onToggle: () => void;
}
export function DesktopMypageSidebar({
  navLinks,
  isOpen,
  onToggle,
}: DesktopSidebMypagearProps): JSX.Element {
  return (
    <Flex
      as="aside"
      position="relative"
      borderRight={1}
      borderStyle="solid"
      borderColor={useColorModeValue('gray.200', 'gray.900')}
      flexDir="column"
      overflowY="auto"
      overflowX="hidden"
      w={isOpen ? 60 : 14} // 4 * 60 = 240px
    >
      {/* 마이페이지 사이드바 닫는 버튼 */}
      <Flex py={2} px={1} pl={3} justify="space-between" alignItems="center">
        {isOpen && (
          <Text fontWeight="medium" fontSize="sm">
            마이페이지
          </Text>
        )}
        <NavbarToggleButton size="sm" onToggle={onToggle} isOpen={isOpen} />
      </Flex>

      <MypageSidebar navLinks={navLinks} isFolded={!isOpen} />
    </Flex>
  );
}

export default DesktopMypageSidebar;
