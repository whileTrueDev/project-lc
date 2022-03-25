import MotionBox from '@project-lc/components-core/MotionBox';
import { Variants } from 'framer-motion';
import { ViewportOptions } from 'framer-motion/types/motion/features/viewport/types';

export const slideFromLeftVariants = (distance = 40): Variants => ({
  hidden: { opacity: 0, x: -distance },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, staggerChildren: 0.3 } },
});

export const slideFromRightVariants = (distance = 40): Variants => ({
  hidden: { opacity: 0, x: distance },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, staggerChildren: 0.3 } },
});

export interface SlideCustomProps {
  isChild?: boolean;
  from?: 'from-left' | 'from-right';
  viewPortOptions?: ViewportOptions;
  boxProps?: Parameters<typeof MotionBox>[0];
  distnaceFrom?: number;
  children: React.ReactChild | React.ReactChild[];
}
/**
 * - 화면상에 이 컴포넌트가 보여질 때 Slide 모션을 실행하는 레이아웃
 * - 각 하위 컴포넌트가 차례로 Slide 모션을 실행하게 하고싶은 경우,
 * <SlideCustom /> 내에 <SlideCustom isChild /> 컴포넌트를 구성해서 생성 가능
 */
export function SlideCustom({
  children,
  viewPortOptions,
  isChild = false,
  from = 'from-left',
  distnaceFrom,
  boxProps,
}: SlideCustomProps): JSX.Element {
  return (
    <MotionBox
      variants={
        from === 'from-right'
          ? slideFromRightVariants(distnaceFrom)
          : slideFromLeftVariants(distnaceFrom)
      }
      initial={isChild ? undefined : 'hidden'}
      exit={isChild ? undefined : 'hidden'}
      whileInView={isChild ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.3, ...viewPortOptions }}
      {...boxProps}
    >
      {children}
    </MotionBox>
  );
}

export default SlideCustom;
