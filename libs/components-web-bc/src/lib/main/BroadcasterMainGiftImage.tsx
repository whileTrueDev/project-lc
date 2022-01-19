import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';

function BroadcasterMainGiftImage(): JSX.Element {
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.4 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };
  const giftVariants = {
    hidden: { opacity: 0, x: -50, y: -20 },
    visible: { opacity: 1, x: 0, y: 0, transition: { duration: 1.2 } },
  };
  return (
    <MotionBox
      viewport={{ once: true, amount: 0.5 }}
      position="relative"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      minH={{ base: '350px', xl: 'unset' }}
    >
      {/* small circle */}
      <MotionBox
        top={{ base: -30, xl: -200 }}
        left={{ base: -300, xl: -170 }}
        width={{ base: 130, xl: 'unset' }}
        position="absolute"
        variants={itemVariants}
      >
        <ChakraNextImage src="/images/main/ellipse-1.png" width="155" height="155" />
      </MotionBox>
      {/* big circle */}
      <MotionBox
        top={{ base: 0, xl: -200 }}
        left={{ base: -175, xl: 0 }}
        width={{ base: 320, xl: 'unset' }}
        position="absolute"
        variants={itemVariants}
      >
        <ChakraNextImage src="/images/main/ellipse-2.png" width="380" height="380" />
      </MotionBox>

      {/* phone */}
      <MotionBox
        top={{ base: 100, xl: -75 }}
        left={{ base: -100, xl: 75 }}
        width={{ base: 400, xl: 'unset' }}
        position="absolute"
        variants={itemVariants}
      >
        <ChakraNextImage src="/images/main/phone-2.png" width="480" height="300" />
      </MotionBox>

      {/* giftbox */}
      <MotionBox
        top={{ base: 100, xl: -85 }}
        left={{ base: 0, xl: 200 }}
        width={{ base: 160, xl: 'unset' }}
        position="absolute"
        variants={giftVariants}
      >
        <ChakraNextImage src="/images/main/gift.png" width="200" height="200" />
      </MotionBox>
    </MotionBox>
  );
}
export default BroadcasterMainGiftImage;
