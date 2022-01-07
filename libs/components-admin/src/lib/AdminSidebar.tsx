import { Box, BoxProps } from '@chakra-ui/react';
import { motion, Variants } from 'framer-motion';
import { NavbarToggleButton as AdminSidebarToggleButton } from '@project-lc/components-shared/navbar';
import React from 'react';

export const MotionBox = motion<BoxProps>(Box);

const sidebarVaraints: Variants = {
  open: { width: '300px' },
  close: { width: '40px' },
};

export interface SlideSidebarProps {
  isOpen: boolean;
  children?: React.ReactNode;
}
/** open시 슬라이드되는 사이드바(트위치 사이드바와 비슷한 형태)
 * 너비 및 애니메이션은 sidebarVaraints에서 조절
 * @param isOpen : true일때 animate open, false 일때 animate close
 */
export function SlideSidebar({ isOpen, children }: SlideSidebarProps): JSX.Element {
  return (
    <MotionBox
      as="nav"
      position="sticky"
      height="100%"
      top={0}
      borderRight="1px solid"
      background="red"
      initial="close"
      animate={isOpen ? 'open' : 'close'}
      variants={sidebarVaraints}
    >
      {children}
    </MotionBox>
  );
}

export interface AdminSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps): JSX.Element {
  return (
    <SlideSidebar isOpen={isOpen}>
      <AdminSidebarToggleButton isOpen={isOpen} onToggle={onToggle} />
      야호~~
    </SlideSidebar>
  );
}

export default AdminSidebar;
