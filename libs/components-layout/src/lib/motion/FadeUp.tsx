import MotionBox from '@project-lc/components-core/MotionBox';
import { ViewportOptions } from 'framer-motion/types/motion/features/viewport/types';
import React from 'react';

export const fadeDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.3 } },
};

export const fadeUpVariants = {
  ...fadeDownVariants,
  hidden: { opacity: 0, y: 20 },
};

export interface FadeUpProps {
  isChild?: boolean;
  direction?: 'up-to-down' | 'down-to-up';
  viewPortOptions?: ViewportOptions;
  boxProps?: Parameters<typeof MotionBox>[0];
  children: React.ReactChild | React.ReactChild[];
}
/**
 * - 화면상에 이 컴포넌트가 보여질 때 Fadeup 모션을 실행하는 레이아웃
 * - 각 하위 컴포넌트가 차례로 Fadeup 모션을 실행하게 하고싶은 경우,
 * <FadeUp /> 내에 <FadeUp isChild /> 컴포넌트를 구성해서 생성 가능
 */
export function FadeUp({
  children,
  viewPortOptions,
  isChild = false,
  direction = 'down-to-up',
  boxProps,
}: FadeUpProps): JSX.Element {
  return (
    <MotionBox
      variants={direction === 'up-to-down' ? fadeDownVariants : fadeUpVariants}
      initial={isChild ? undefined : 'hidden'}
      exit={isChild ? undefined : 'hidden'}
      whileInView={isChild ? undefined : 'visible'}
      // animate={isChild ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.3, ...viewPortOptions }}
      {...boxProps}
    >
      {children}
    </MotionBox>
  );
}

export default FadeUp;
