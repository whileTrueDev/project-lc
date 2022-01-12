import { Image } from '@chakra-ui/react';
import { ChakraNextImage } from '@project-lc/components-core/ChakraNextImage';
import { MotionBox } from '@project-lc/components-core/MotionBox';

export function BroadcasterMainIntroduceImage(): JSX.Element {
  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.4 } },
  };
  const itemXVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };
  const itemYVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
      {/* 노란 배경 */}
      <MotionBox
        key="yellow"
        position="absolute"
        top={{ base: '-80px', xl: -50 }}
        right={{ base: -330, xl: -200 }}
        viewport={{ amount: 0.2 }}
        variants={itemXVariants}
      >
        <Image
          src="/images/main/effect-1.png"
          width={{ base: 500, sm: 600 }}
          height={{ base: 330, sm: 400 }}
        />
      </MotionBox>

      {/* 폰 */}
      <MotionBox key="phone" viewport={{ amount: 0.5 }} variants={itemYVariants}>
        <ChakraNextImage src="/images/main/phone-1.png" width="420" height="210" />
      </MotionBox>

      {/* 라이브쇼핑화면URL */}
      <MotionBox
        key="liveshopping-url"
        position="absolute"
        top={{ base: '30px', sm: 50 }}
        right={{ base: 0, xl: 110 }}
        viewport={{ amount: 0.5 }}
        variants={itemYVariants}
      >
        <ChakraNextImage
          src="/images/main/liveshopping-url-1.png"
          width="320"
          height="45"
        />
      </MotionBox>
      {/* URL복사 */}

      <MotionBox
        key="liveshopping-url-copy"
        position="absolute"
        top={{ base: '70px', sm: 90 }}
        right={{ base: 0, xl: 110 }}
        viewport={{ amount: 0.5 }}
        variants={itemYVariants}
      >
        <ChakraNextImage src="/images/main/url-copy-1.png" width="90" height="42" />
      </MotionBox>
    </MotionBox>
  );
}
export default BroadcasterMainIntroduceImage;
