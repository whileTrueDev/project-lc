import { Flex, Text, useColorModeValue } from '@chakra-ui/react';
import { mypageDesktopSidebarStore } from '@project-lc/stores';
import MypageSidebar, { MypageSidebarPrpps } from './MypageSidebar';
import { NavbarToggleButton } from './NavbarToggleButton';

type DesktopSidebMypagearProps = MypageSidebarPrpps;
export function DesktopMypageSidebar({
  navLinks,
}: DesktopSidebMypagearProps): JSX.Element {
  const { isOpen, onToggle } = mypageDesktopSidebarStore();
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
      <Flex
        py={2}
        px={isOpen ? 3 : 0}
        justify={isOpen ? 'space-between' : 'center'}
        alignItems="center"
      >
        {isOpen && (
          <Text fontWeight="medium" fontSize="sm">
            메뉴
          </Text>
        )}
        <NavbarToggleButton size="sm" onToggle={onToggle} isOpen={isOpen} />
      </Flex>

      <MypageSidebar navLinks={navLinks} isFolded={!isOpen} />
    </Flex>
  );
}

export default DesktopMypageSidebar;
