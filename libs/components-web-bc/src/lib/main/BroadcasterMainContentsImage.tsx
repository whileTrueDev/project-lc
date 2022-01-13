import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';

function BroadcasterMainContentsImage(): JSX.Element {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.4 } },
  };
  const itemYVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };
  const itemXVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 1 } },
  };
  const itemXRotateVariants = {
    hidden: { opacity: 0, x: -150 },
    visible: { opacity: 1, x: 0, rotate: 360, transition: { duration: 0.5, delay: 1 } },
  };
  return (
    <MotionBox
      viewport={{ once: true, amount: 0.5 }}
      position="relative"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      minH={{ base: '300px', xl: 'unset' }}
    >
      <MotionBox
        position="absolute"
        top={{ base: 90, xl: -30 }}
        right={{ base: -240, xl: 0 }}
        width={{ base: 150, xl: 'unset' }}
        variants={itemYVariants}
      >
        <ChakraNextImage src="/images/main/intro3_img3.png" width="200" height="200" />
      </MotionBox>

      <MotionBox
        position="absolute"
        top={{ base: 0, xl: -180 }}
        right={{ base: -150, xl: 100 }}
        width={{ base: 300, xl: 'unset' }}
        variants={itemYVariants}
      >
        <ChakraNextImage src="/images/main/intro3_img2.png" width="400" height="400" />
      </MotionBox>

      <MotionBox
        position="absolute"
        top={{ base: 200, xl: 85 }}
        left={{ base: -380, xl: -250 }}
        width={{ base: 320, xl: 'unset' }}
        variants={itemXVariants}
      >
        <ChakraNextImage
          src="/images/main/intro3_yellow-grad.png"
          width="450"
          height="100"
        />
      </MotionBox>

      <MotionBox
        position="absolute"
        top={{ base: 185, xl: 70 }}
        left={{ base: -130, xl: 130 }}
        width={{ base: '100px', xl: 'unset' }}
        variants={itemXRotateVariants}
      >
        <ChakraNextImage src="/images/main/intro3_coin.png" width="120" height="120" />
      </MotionBox>
    </MotionBox>
  );
}

export default BroadcasterMainContentsImage;
